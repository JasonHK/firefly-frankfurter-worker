import { Temporal } from "temporal-polyfill";

import { InputValidationException, InternalServerErrorException, OpenAPIRoute, contentJson, type OpenAPIRouteSchema } from "chanfana";
import { z } from "zod";

import { FrankfurterError } from "frankfurter-js";

import Currency from "../_types/currency.generated";

export default class WeeklyRates extends OpenAPIRoute
{
    schema = {
        request: {
            params: z.object({
                year: z.int().min(1948),
                isoWeek: z.int().min(1).max(53),
                currency: Currency,
            }),
        },
        responses: {
            "200": {
                description: "",
                ...contentJson(z.object({
                    date: z.iso.date(),
                    rates: z.record(Currency, z.number()),
                })),
            },
            ...InputValidationException.schema(),
        },
    } satisfies OpenAPIRouteSchema;

    async handle(c: WorkerContext)
    {
        const { params } = await this.getValidatedData<typeof this.schema>();
        
        if (params.isoWeek > Temporal.PlainDate.from({ year: params.year, month: 12, day: 28 }).weekOfYear!)
        {
            throw new InputValidationException("This year refuses to acknowledge the existence of week 53", ["params", "isoWeek"]);
        }
        else if (params.year > c.var.today.year)
        {
            throw new InputValidationException("You are not allowed to travel to a future year", ["params", "year"]);
        }
        else if ((params.year === c.var.today.year) && (params.isoWeek > (c.var.today.weekOfYear!)))
        {
            throw new InputValidationException("You are not allowed to travel to a future ISO week", ["params", "isoWeek"]);
        }

        const forthOfJanuary = Temporal.PlainDate.from({ year: params.year, month: 1, day: 4 });
        const firstIsoWeekMonday = forthOfJanuary.subtract({ days: forthOfJanuary.dayOfWeek - 1 });
        const date = firstIsoWeekMonday.add({ weeks: params.isoWeek - 1 });

        try
        {
            const rates = Object.fromEntries(
                (await c.var.frankfurter.historical(date.toString(), { base: params.currency }))
                    .filter((rate) => (rate.quote !== params.currency))
                    .map((rate) => [rate.quote, rate.rate]));

            return { date, rates };
        }
        catch (error: unknown)
        {
            if (error instanceof FrankfurterError)
            {
                throw new InternalServerErrorException(error.message);
            }
        }
    }
}
