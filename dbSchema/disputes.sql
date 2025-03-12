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
    "dispute_ID" integer NOT NULL,
    "review_ID" integer NOT NULL,
    flagged_reason text NOT NULL,
    dispute_status smallint DEFAULT 0 NOT NULL
);

ALTER TABLE public.disputes OWNER TO postgres;

COMMENT ON COLUMN public.disputes.dispute_status IS '0 = not resolved
1 = resolved';

ALTER TABLE public.disputes ALTER COLUMN "dispute_ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Disputes_dispute_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

COPY public.disputes ("dispute_ID", "review_ID", flagged_reason, dispute_status) FROM stdin;
\.

SELECT pg_catalog.setval('public."Disputes_dispute_ID_seq"', 1, false);

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "Disputes_pkey" PRIMARY KEY ("dispute_ID");

CREATE INDEX "idx_disputes_reviewID" ON public.disputes USING btree ("review_ID") WITH (deduplicate_items='true');

CREATE INDEX idx_disputes_status ON public.disputes USING btree (dispute_status) WITH (deduplicate_items='true');

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "review_ID_fkey" FOREIGN KEY ("review_ID") REFERENCES public.reviews("review_ID") ON UPDATE CASCADE ON DELETE CASCADE;
