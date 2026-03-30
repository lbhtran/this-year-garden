-- Migration 0004: drop FK constraints from plant_allocations
-- The FKs added in 0003 prevent MCP from creating allocations that link
-- web-app plants (user_id = Clerk ID) to MCP-managed containers (user_id = 'mcp').
-- Drop them if they exist so the table works across user contexts.

ALTER TABLE plant_allocations DROP CONSTRAINT IF EXISTS plant_allocations_user_id_plant_id_fkey;
ALTER TABLE plant_allocations DROP CONSTRAINT IF EXISTS plant_allocations_user_id_container_id_fkey;
