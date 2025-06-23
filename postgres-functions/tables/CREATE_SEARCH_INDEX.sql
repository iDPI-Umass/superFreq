create index IF not exists idx_title_search on public.collections_info using gin (title_search) TABLESPACE pg_default;

create index IF not exists trgm_idx_username on public.profiles using gist (username gist_trgm_ops) TABLESPACE pg_default;

create index IF not exists trgm_idx_display_name on public.profiles using gist (display_name gist_trgm_ops) TABLESPACE pg_default;