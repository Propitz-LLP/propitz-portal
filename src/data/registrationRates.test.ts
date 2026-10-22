/* Run with `npm run test:rates` (Node's built-in runner, no build step). */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  REGISTRATION_FEE,
  STAMP_DUTY,
  WOMEN_CONCESSION,
  RATES_CHECKED,
  indianDate,
  inForce,
  saleDeedRatesOn,
  type DatedRate,
} from "./registrationRates.ts";

const histories: [string, DatedRate[]][] = [
  ["STAMP_DUTY", STAMP_DUTY],
  ["REGISTRATION_FEE", REGISTRATION_FEE],
  ["WOMEN_CONCESSION", WOMEN_CONCESSION],
];

for (const [name, history] of histories) {
  test(`${name}: entries are well formed and in date order`, () => {
    assert.ok(history.length > 0);
    for (const e of history) {
      assert.match(e.from, /^\d{4}-\d{2}-\d{2}$/, `${name} from ${e.from}`);
      assert.ok(!Number.isNaN(Date.parse(e.from)), `${name} from ${e.from} is a real date`);
      assert.ok(e.rate > 0 && e.rate < 0.2, `${name} rate ${e.rate} looks like a fraction, not a percent`);
      assert.ok(e.order.trim().length > 10, `${name} ${e.from} cites its order`);
    }
    for (let i = 1; i < history.length; i++) {
      assert.ok(history[i].from > history[i - 1].from, `${name} entries ascend by date`);
    }
  });
}

test("the registration fee fell from 4% to 2% on 1 April 2023", () => {
  assert.equal(saleDeedRatesOn("2023-03-31").registrationFee, 0.04);
  assert.equal(saleDeedRatesOn("2023-04-01").registrationFee, 0.02);
});

test("current sale deed rates", () => {
  const r = saleDeedRatesOn("2026-10-22");
  assert.equal(r.stampDuty, 0.07);
  assert.equal(r.registrationFee, 0.02);
  assert.equal(r.womenConcession, 0.01);
  assert.equal(r.womenConcessionMaxValue, 10_00_000);
  assert.equal(r.orders.length, 3);
});

test("no women's concession before it was introduced", () => {
  const r = saleDeedRatesOn("2025-03-31");
  assert.equal(r.womenConcession, 0);
  assert.equal(r.orders.length, 2);
});

test("a rate added ahead of its start date waits for it", () => {
  const history: DatedRate[] = [
    { rate: 0.02, from: "2023-04-01", order: "current order" },
    { rate: 0.03, from: "2099-01-01", order: "future order" },
  ];
  assert.equal(inForce(history, "2098-12-31")?.rate, 0.02);
  assert.equal(inForce(history, "2099-01-01")?.rate, 0.03);
});

test("no rates before the first entry", () => {
  assert.throws(() => saleDeedRatesOn("2000-01-01"), /No sale deed rates/);
});

test("dates are Indian dates: 1 April starts at Indian midnight", () => {
  assert.equal(indianDate(new Date("2023-03-31T18:29:00Z")), "2023-03-31");
  assert.equal(indianDate(new Date("2023-03-31T18:30:00Z")), "2023-04-01");
});

test("rates were checked within the last six months", () => {
  const age = (Date.now() - Date.parse(`${RATES_CHECKED}T00:00:00+05:30`)) / 86_400_000;
  assert.ok(age >= 0, `RATES_CHECKED (${RATES_CHECKED}) is in the future`);
  assert.ok(
    age <= 183,
    `RATES_CHECKED is ${Math.floor(age)} days old. Re-verify every rate against TNREGINET, then update RATES_CHECKED.`
  );
});
