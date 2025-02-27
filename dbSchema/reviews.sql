--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    "review_ID" integer NOT NULL,
    platform character varying(255) NOT NULL,
    rating integer NOT NULL,
    content text NOT NULL,
    "timestamp" timestamp with time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: Reviews_review_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reviews ALTER COLUMN "review_ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Reviews_review_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4804 (class 0 OID 16389)
-- Dependencies: 218
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews ("review_ID", platform, rating, content, "timestamp") FROM stdin;
\.


--
-- TOC entry 4810 (class 0 OID 0)
-- Dependencies: 217
-- Name: Reviews_review_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reviews_review_ID_seq"', 1, false);


--
-- TOC entry 4653 (class 2606 OID 16395)
-- Name: reviews Reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY ("review_ID");


--
-- TOC entry 4654 (class 1259 OID 16426)
-- Name: idx_reviews_content; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_content ON public.reviews USING btree (content) WITH (deduplicate_items='true');


--
-- TOC entry 4655 (class 1259 OID 16424)
-- Name: idx_reviews_platform; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_platform ON public.reviews USING btree (platform) WITH (deduplicate_items='true');


--
-- TOC entry 4656 (class 1259 OID 16425)
-- Name: idx_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating) WITH (deduplicate_items='true');


--
-- TOC entry 4657 (class 1259 OID 16440)
-- Name: idx_reviews_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_timestamp ON public.reviews USING btree ("timestamp") WITH (deduplicate_items='true');
