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

CREATE TABLE public.disputes (
    dispute_id integer NOT NULL,
    review_id integer NOT NULL,
    flagged_reason text,
    dispute_status smallint DEFAULT 0 NOT NULL,
    analysis_data jsonb
);

ALTER TABLE public.disputes OWNER TO postgres;

COMMENT ON COLUMN public.disputes.dispute_status IS '0 = normal
1 = escalated
2 = resolved
3 = removed';

ALTER TABLE public.disputes ALTER COLUMN dispute_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Disputes_dispute_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

SELECT pg_catalog.setval('public."Disputes_dispute_ID_seq"', 1, false);

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "Disputes_pkey" PRIMARY KEY (dispute_id);

CREATE INDEX "idx_disputes_reviewId" ON public.disputes USING btree (review_id) WITH (deduplicate_items='true');

CREATE INDEX idx_disputes_status ON public.disputes USING btree (dispute_status) WITH (deduplicate_items='true');

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(review_id) ON UPDATE CASCADE ON DELETE CASCADE;