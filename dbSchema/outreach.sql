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
-- TOC entry 222 (class 1259 OID 16411)
-- Name: outreach; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outreach (
    "outreach_ID" integer NOT NULL,
    "review_ID" integer NOT NULL,
    call_history text NOT NULL,
    resolution_status smallint DEFAULT 0 NOT NULL
);


ALTER TABLE public.outreach OWNER TO postgres;

--
-- TOC entry 4810 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN outreach.resolution_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.outreach.resolution_status IS '0 = not resolved
1 = resolved';


--
-- TOC entry 221 (class 1259 OID 16410)
-- Name: Outreach_outreach_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.outreach ALTER COLUMN "outreach_ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Outreach_outreach_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4804 (class 0 OID 16411)
-- Dependencies: 222
-- Data for Name: outreach; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.outreach ("outreach_ID", "review_ID", call_history, resolution_status) FROM stdin;
\.


--
-- TOC entry 4811 (class 0 OID 0)
-- Dependencies: 221
-- Name: Outreach_outreach_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Outreach_outreach_ID_seq"', 1, false);


--
-- TOC entry 4654 (class 2606 OID 16418)
-- Name: outreach Outreach_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outreach
    ADD CONSTRAINT "Outreach_pkey" PRIMARY KEY ("outreach_ID");


--
-- TOC entry 4655 (class 1259 OID 16430)
-- Name: idx_outreach_reviewID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_outreach_reviewID" ON public.outreach USING btree ("review_ID") WITH (deduplicate_items='true');


--
-- TOC entry 4656 (class 1259 OID 16431)
-- Name: idx_outreach_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_outreach_status ON public.outreach USING btree (resolution_status) WITH (deduplicate_items='true');


--
-- TOC entry 4657 (class 2606 OID 16419)
-- Name: outreach review_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outreach
    ADD CONSTRAINT "review_ID_fkey" FOREIGN KEY ("review_ID") REFERENCES public.reviews("review_ID") ON UPDATE CASCADE ON DELETE CASCADE;
