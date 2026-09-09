import type { Customer, Trip } from "./types";
import { statsForCustomerId, type CustomerStats as IdStats } from "./finance";

export {
  tripsIn,
  expensesIn,
  tripGrossOf as grossOf,
  faresOf,
  tipsOf,
  spendOf,
  kmOf,
  minutesOf,
  ratedTrips,
  avgRating,
  byPlatform,
  byExpense,
  weekSeries,
} from "./finance";

export type CustomerStats = IdStats & { customer: Customer };

export function statsForCustomer(customer: Customer, trips: Trip[]): CustomerStats {
  return { customer, ...statsForCustomerId(customer.id, trips) };
}

export function topCustomers(customers: Customer[], trips: Trip[], limit = 5): CustomerStats[] {
  return customers
    .map((c) => statsForCustomer(c, trips))
    .sort((a, b) => b.gross - a.gross)
    .slice(0, limit);
}
