import { chromium } from 'playwright';
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const base = 'http://localhost:3100';
const pages = [
  ['home','/'],
  ['about','/about-us'],
  ['services','/services'],
  ['service-detail','/services/property-registration-assistance'],
  ['marketplace','/property-marketplace'],
  ['contact','/contact-us'],
  ['resource','/resources/ec-patta-chitta-gv'],
  ['blog','/blog'],
  ['blog-post','/blog/what-is-property-verification-why-it-matters-before-any-property-purchase'],
];
const browser = await chromium.launch({ executablePath: exe });
for (const [w,label] of [[1440,'desktop'],[390,'mobile']]) {
  const ctx = await browser.newContext({ viewport:{width:w,height:900}, deviceScaleFactor:1 });
  const pg = await ctx.newPage();
  for (const [name,path] of pages) {
    if (label==='mobile' && !['home','services','contact'].includes(name)) continue;
    await pg.goto(base+path, {waitUntil:'networkidle', timeout:20000}).catch(()=>{});
    await pg.waitForTimeout(700);
    const file = `/tmp/shots/${label}-${name}.png`;
    await pg.screenshot({ path:file, fullPage: label==='desktop' });
    console.log('shot', file);
  }
  await ctx.close();
}
await browser.close();
console.log('DONE');
