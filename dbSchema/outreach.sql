SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.outreach (
    outreach_id integer NOT NULL,
    review_id integer NOT NULL,
    call_history text NOT NULL,
    resolution_status smallint DEFAULT 0 NOT NULL
);

ALTER TABLE public.outreach OWNER TO postgres;

COMMENT ON COLUMN public.outreach.resolution_status IS '0 = not resolved
1 = resolved';

ALTER TABLE public.outreach ALTER COLUMN outreach_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Outreach_outreach_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


SELECT pg_catalog.setval('public."Outreach_outreach_ID_seq"', 1, false);

ALTER TABLE ONLY public.outreach
    ADD CONSTRAINT "Outreach_pkey" PRIMARY KEY (outreach_id);

CREATE INDEX "idx_outreach_reviewId" ON public.outreach USING btree (review_id) WITH (deduplicate_items='true');

CREATE INDEX idx_outreach_status ON public.outreach USING btree (resolution_status) WITH (deduplicate_items='true');

ALTER TABLE ONLY public.outreach
    ADD CONSTRAINT review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(review_id) ON UPDATE CASCADE ON DELETE CASCADE;