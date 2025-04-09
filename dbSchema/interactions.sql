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

CREATE TABLE public.interactions (
    response_id integer NOT NULL,
    review_id integer NOT NULL,
    response_text text NOT NULL,
    created_at timestamp without time zone,
    user_id integer
);

ALTER TABLE public.interactions OWNER TO postgres;

ALTER TABLE public.interactions ALTER COLUMN response_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.interactions_response_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

COPY public.interactions (response_id, review_id, response_text, created_at, user_id) FROM stdin;
\.

SELECT pg_catalog.setval('public.interactions_response_id_seq', 1, false);

ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT interactions_pkey PRIMARY KEY (response_id);

CREATE INDEX "idx_interactions_reviewId" ON public.interactions USING btree (review_id) WITH (deduplicate_items='true');

ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(review_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL NOT VALID;