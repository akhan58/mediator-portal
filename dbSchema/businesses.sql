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

CREATE TABLE public.businesses (
    business_id integer NOT NULL,
    business_name character varying(255) NOT NULL,
    user_id integer NOT NULL,
    facebook_page_id character varying(255),
    google_place_id character varying(255),
    trustpilot_businessunit_id character varying(255),
    yelp_business_id character varying(255)
);

ALTER TABLE public.businesses OWNER TO postgres;

ALTER TABLE public.businesses ALTER COLUMN business_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.businesses_business_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

COPY public.businesses (business_id, business_name, user_id, facebook_page_id, google_place_id, trustpilot_businessunit_id, yelp_business_id) FROM stdin;
\.

SELECT pg_catalog.setval('public.businesses_business_id_seq', 1, false);

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_pkey PRIMARY KEY (business_id);

CREATE INDEX idx_businesses_user_id ON public.businesses USING btree (user_id) WITH (deduplicate_items='true');

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;