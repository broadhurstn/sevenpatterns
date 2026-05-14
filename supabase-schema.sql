-- Run this in your Supabase SQL editor to create the submissions table

create table quiz_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  age integer,
  location text,
  problem text,
  closing text,
  answers jsonb,
  primary_pattern text not null,
  secondary_pattern text not null,
  raw_scores jsonb,
  submitted_at timestamptz default now()
);

-- Index for querying by pattern
create index idx_primary_pattern on quiz_submissions(primary_pattern);
create index idx_submitted_at on quiz_submissions(submitted_at desc);

-- Row level security (optional but recommended)
alter table quiz_submissions enable row level security;
