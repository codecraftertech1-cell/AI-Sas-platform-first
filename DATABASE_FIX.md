# Database Schema Fix Guide

## Issues Fixed

1. **Missing ID defaults**: All models now have `@default(cuid())` to auto-generate IDs
2. **Missing relations**: Added proper Prisma relations between models
3. **Fixed `_count` query**: Updated user dashboard query to use correct Prisma syntax
4. **Added `@updatedAt`**: All models now auto-update `updatedAt` field

## Steps to Fix Database

### Step 1: Create a new migration

```bash
cd backend
npx prisma migrate dev --name fix_id_defaults_and_relations
```

This will:
- Create a new migration file
- Apply changes to your database
- Regenerate Prisma Client

### Step 2: If migration fails (existing data)

If you have existing data and the migration fails, you have two options:

**Option A: Reset database (⚠️ WARNING: Deletes all data)**
```bash
cd backend
npx prisma migrate reset
```

**Option B: Manual migration (preserves data)**

1. Open your MySQL database
2. For each table, add default values to `id` columns:
   ```sql
   -- Note: This is just an example. You may need to adjust based on your MySQL version
   -- For MySQL 8.0+, you can use UUID() function
   -- For older versions, you'll need to generate IDs in application code
   ```

   Or simply let Prisma handle it - the `@default(cuid())` will generate IDs when creating new records.

### Step 3: Regenerate Prisma Client

```bash
cd backend
npx prisma generate
```

### Step 4: Restart your backend server

The backend should now work correctly with:
- ✅ Auto-generated IDs for all models
- ✅ Proper relations between models
- ✅ Fixed dashboard `_count` query

## What Changed

### Schema Changes:
- All `id` fields now have `@default(cuid())` - generates unique IDs automatically
- Added `@updatedAt` to all models - auto-updates timestamp
- Added proper relations between User and all other models
- Added relation names to avoid conflicts

### Code Changes:
- Fixed `user.js` dashboard route to use correct `_count` syntax
- Removed reference to `totalCreditsUsed` in select (not needed)

## Testing

After applying the migration:

1. **Test Registration:**
   - Try registering a new user
   - Should work without "Argument `id` is missing" error

2. **Test Chat Creation:**
   - Try creating a new chat
   - Should work without "Argument `id` is missing" error

3. **Test Dashboard:**
   - Login and check dashboard
   - Should show counts without `_count` error

## Troubleshooting

If you still see errors:

1. **Check Prisma Client is regenerated:**
   ```bash
   cd backend
   npx prisma generate
   ```

2. **Check database connection:**
   ```bash
   cd backend
   npx prisma db pull
   ```

3. **Verify schema matches database:**
   ```bash
   cd backend
   npx prisma studio
   ```

4. **Check for migration issues:**
   ```bash
   cd backend
   npx prisma migrate status
   ```

## Notes

- `cuid()` generates collision-resistant unique identifiers client-side
- Works with all databases (MySQL, PostgreSQL, SQLite, etc.)
- No database functions required - Prisma generates IDs in application code
- IDs are URL-safe and sortable

