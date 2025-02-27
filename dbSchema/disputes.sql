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
-- TOC entry 220 (class 1259 OID 16397)
-- Name: disputes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disputes (
    "dispute_ID" integer NOT NULL,
    "review_ID" integer NOT NULL,
    flagged_reason text NOT NULL,
    dispute_status smallint DEFAULT 0 NOT NULL
);


ALTER TABLE public.disputes OWNER TO postgres;

--
-- TOC entry 4810 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN disputes.dispute_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.disputes.dispute_status IS '0 = not resolved
1 = resolved';


--
-- TOC entry 219 (class 1259 OID 16396)
-- Name: Disputes_dispute_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.disputes ALTER COLUMN "dispute_ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Disputes_dispute_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4804 (class 0 OID 16397)
-- Dependencies: 220
-- Data for Name: disputes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disputes ("dispute_ID", "review_ID", flagged_reason, dispute_status) FROM stdin;
\.


--
-- TOC entry 4811 (class 0 OID 0)
-- Dependencies: 219
-- Name: Disputes_dispute_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Disputes_dispute_ID_seq"', 1, false);


--
-- TOC entry 4654 (class 2606 OID 16404)
-- Name: disputes Disputes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "Disputes_pkey" PRIMARY KEY ("dispute_ID");


--
-- TOC entry 4655 (class 1259 OID 16428)
-- Name: idx_disputes_reviewID; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_disputes_reviewID" ON public.disputes USING btree ("review_ID") WITH (deduplicate_items='true');


--
-- TOC entry 4656 (class 1259 OID 16429)
-- Name: idx_disputes_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_disputes_status ON public.disputes USING btree (dispute_status) WITH (deduplicate_items='true');


--
-- TOC entry 4657 (class 2606 OID 16405)
-- Name: disputes review_ID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT "review_ID_fkey" FOREIGN KEY ("review_ID") REFERENCES public.reviews("review_ID") ON UPDATE CASCADE ON DELETE CASCADE;
