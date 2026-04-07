# support@creatorflow365.com — Step-by-Step (Where + What)

Do these in order. Each step says **WHERE** and **WHAT** to do.

---

## PART A: ImprovMX (email forwarding service)

### A1. Open ImprovMX and add your domain

- **WHERE:** In your browser go to: **https://improvmx.com**
- **WHAT:** Sign up or log in. Then click **Add domain**, type **creatorflow365.com**, click **Add**.

### A2. Get the verification TXT from ImprovMX

- **WHERE:** Stay on ImprovMX, on the page for **creatorflow365.com**.
- **WHAT:** ImprovMX will show a line like “Add this TXT record” with:
  - A **name/host** (e.g. `improvmx` or `@`)
  - A **value** (long string of letters/numbers)
- **Copy or write down** that name and that value. You’ll paste them in Vercel in Part B.

### A3. Get the MX records from ImprovMX

- **WHERE:** Same ImprovMX page for **creatorflow365.com**.
- **WHAT:** ImprovMX will show **MX records**, usually two lines, for example:
  - Priority **10** → **mx1.improvmx.com**
  - Priority **20** → **mx2.improvmx.com**
- **Copy or write down** those two (priority + host). You’ll add them in Vercel in Part B.

### A4. Create the support@ forward (after DNS is done)

- **WHERE:** ImprovMX → **creatorflow365.com** → **Aliases** or **Forwarding** or **Mailboxes**.
- **WHAT:** Add an alias: **support** → forward to **your real email** (e.g. your Gmail). Save.  
  That makes **support@creatorflow365.com** forward to your inbox.

---

## PART B: Vercel (where you add the DNS records)

### B1. Open the DNS page for creatorflow365.com

- **WHERE:** In your browser go to: **https://vercel.com**
- **WHAT:**
  1. Log in.
  2. Click **Domains** in the top navigation (team level, not inside a project).
  3. In the list, **click the domain name** **creatorflow365.com** (the text itself).
  4. On the domain page, scroll to the **DNS Records** section. You should see a form to add a record (Name, Type, Value, TTL, Priority).

### B2. Add the TXT record (verification)

- **WHERE:** Same page: **Vercel → Domains → creatorflow365.com → DNS Records** (the add-record form).
- **WHAT:**
  1. In the **Name** field: type the name ImprovMX gave you (e.g. **improvmx** or **@**). If ImprovMX said “root” or “@”, use **@**.
  2. In the **Type** dropdown: choose **TXT**.
  3. In the **Value** field: paste the long verification string from ImprovMX (the whole thing).
  4. Leave TTL as 60. Leave Priority empty.
  5. Click **Add** (or Save).

### B3. Add the first MX record

- **WHERE:** Same DNS Records section; use the form again (or “Add record”).
- **WHAT:**
  1. **Name:** type **@**
  2. **Type:** choose **MX**
  3. **Value:** type **mx1.improvmx.com** (or the first MX host ImprovMX gave you)
  4. **Priority:** type **10** (or the first number ImprovMX gave you)
  5. Click **Add**

### B4. Add the second MX record

- **WHERE:** Same DNS Records section; add another record.
- **WHAT:**
  1. **Name:** **@**
  2. **Type:** **MX**
  3. **Value:** **mx2.improvmx.com** (or the second MX host from ImprovMX)
  4. **Priority:** **20** (or the second number from ImprovMX)
  5. Click **Add**

### B5. Verify in ImprovMX

- **WHERE:** Go back to **https://improvmx.com** → **creatorflow365.com**.
- **WHAT:** Click **Verify** (or “Verify domain”). Wait a few minutes if it says “pending”. When it says verified, you’re done with DNS.

### B6. Set the support@ forward (if you didn’t in A4)

- **WHERE:** ImprovMX → **creatorflow365.com** → **Aliases** / **Forwarding**.
- **WHAT:** Add: **support** forwards to **your Gmail** (or whatever email you use). Save.

---

## PART C: Test

- **WHERE:** Any email app (e.g. your phone or another account).
- **WHAT:** Send an email **to** **support@creatorflow365.com**. It should show up in the inbox you set as “Forward to” in ImprovMX (e.g. your Gmail).

---

## Quick reference: where is what?

| What you’re doing              | Where to do it                                                                 |
|-------------------------------|-------------------------------------------------------------------------------|
| Add domain, get TXT/MX text   | **improvmx.com** → Add domain → creatorflow365.com → copy TXT and MX from there |
| Add TXT and MX records        | **vercel.com** → **Domains** (top nav) → click **creatorflow365.com** → **DNS Records** |
| Add support → your email      | **improvmx.com** → creatorflow365.com → **Aliases** / **Forwarding**           |
| Verify domain                 | **improvmx.com** → creatorflow365.com → **Verify**                            |

After this, support@creatorflow365.com is set. You don’t need to change it again unless you switch provider or email.
