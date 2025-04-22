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

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    platform character varying(255) NOT NULL,
    rating integer NOT NULL,
    content text NOT NULL,
    "timestamp" date NOT NULL,
    source_id character varying(255) NOT NULL,
    user_id integer,
    analysis_data jsonb,
    status smallint DEFAULT 0
);

ALTER TABLE public.reviews OWNER TO postgres;

COMMENT ON COLUMN public.reviews.status IS '0 = normal
1 = flagged
2 = disputed
3 = removed';

ALTER TABLE public.reviews ALTER COLUMN review_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Reviews_review_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

COPY public.reviews (review_id, platform, rating, content, "timestamp", source_id, user_id, analysis_data, status) FROM stdin;

SELECT pg_catalog.setval('public."Reviews_review_ID_seq"', 1, false);

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY (review_id);

CREATE INDEX idx_reviews_content ON public.reviews USING btree (content) WITH (deduplicate_items='true');

CREATE INDEX idx_reviews_platform ON public.reviews USING btree (platform) WITH (deduplicate_items='true');

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating) WITH (deduplicate_items='true');

CREATE INDEX idx_reviews_timestamp ON public.reviews USING btree ("timestamp") WITH (deduplicate_items='true');

CREATE INDEX idx_reviews_user_id ON public.reviews USING btree (user_id) WITH (deduplicate_items='true');

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;