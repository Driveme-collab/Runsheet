import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_PRIORITIES,
  DEFAULT_REMINDERS,
  EMPTY_BUDGET,
  driverProfileFromSettings,
  vehicleFromSettings,
  type Settings,
} from "./types.ts";

function settings(patch: Partial<Settings> = {}): Settings {
  return {
    driverName: "",
    vehicleMake: "",
    vehicleModel: "",
    plate: "",
    year: "",
    currency: "RWF",
    weeklyTarget: 0,
    city: "",
    sampleData: false,
    onboarded: false,
    drivingSituation: "own",
    workSources: [],
    fuelType: "petrol",
    currentMileage: 0,
    purchaseValue: null,
    nextLevel: null,
    budget: { ...EMPTY_BUDGET },
    priorities: { ...DEFAULT_PRIORITIES },
    reminders: { ...DEFAULT_REMINDERS },
    ...patch,
  };
}

describe("driver profile projection", () => {
  it("reads identity from settings without exposing money fields", () => {
    const profile = driverProfileFromSettings(
      settings({ driverName: "Aline", city: "Kigali", weeklyTarget: 90000 }),
    );
    assert.equal(profile.name, "Aline");
    assert.equal(profile.city, "Kigali");
    assert.equal(profile.currency, "RWF");
    assert.equal("weeklyTarget" in profile, false);
  });

  it("returns no vehicle until make, model or plate is set", () => {
    assert.equal(vehicleFromSettings(settings()), null);
    const vehicle = vehicleFromSettings(
      settings({ vehicleMake: "Toyota", vehicleModel: "Succeed", plate: "RAD 000 A" }),
    );
    assert.ok(vehicle);
    assert.equal(vehicle.make, "Toyota");
    assert.equal(vehicle.id, "vehicle-primary");
  });
});
