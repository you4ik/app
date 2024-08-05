--
-- PostgreSQL database dump
--

-- Dumped from database version 15.7
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: driver; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.driver (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: driver_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.driver_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.driver_id_seq OWNED BY public.driver.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.items (
    id integer NOT NULL,
    item_type character varying(3) NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    currency character varying(3) NOT NULL
);


--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    kol integer NOT NULL,
    sum integer NOT NULL,
    stop integer DEFAULT 300 NOT NULL,
    "desc" text,
    date date,
    client integer DEFAULT 0,
    vendor_id integer,
    driver_id integer,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    items jsonb,
    total_sums jsonb
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: vendor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vendor (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    contact_info text
);


--
-- Name: vendor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vendor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vendor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vendor_id_seq OWNED BY public.vendor.id;


--
-- Name: driver id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver ALTER COLUMN id SET DEFAULT nextval('public.driver_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: vendor id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendor ALTER COLUMN id SET DEFAULT nextval('public.vendor_id_seq'::regclass);


--
-- Data for Name: driver; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.driver (id, name) FROM stdin;
1	Habibi
2	Jewa
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.items (id, item_type, quantity, price, currency) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, kol, sum, stop, "desc", date, client, vendor_id, driver_id, create_date, items, total_sums) FROM stdin;
404	1	800	300	\N	2024-08-01	0	1	1	2024-08-05 09:46:30.683237	\N	\N
296	6	3000	300		2024-07-06	0	1	1	2024-08-05 09:46:30.683237	\N	\N
297	6	0	300		2024-07-06	0	1	1	2024-08-05 09:46:30.683237	\N	\N
298	1	1000	300		2024-07-06	0	1	1	2024-08-05 09:46:30.683237	\N	\N
299	8	3500	0		2024-07-06	0	1	1	2024-08-05 09:46:30.683237	\N	\N
300	2	1600	300		2024-07-06	0	1	1	2024-08-05 09:46:30.683237	\N	\N
301	1	600	300		2024-07-06	0	1	1	2024-08-05 09:46:30.683237	\N	\N
302	1	1000	300		2024-07-06	0	1	1	2024-08-05 09:46:30.683237	\N	\N
303	1	1000	300		2024-07-06	0	1	1	2024-08-05 09:46:30.683237	\N	\N
304	3	2400	300		2024-07-07	0	1	1	2024-08-05 09:46:30.683237	\N	\N
305	15	0	300		2024-07-07	0	1	1	2024-08-05 09:46:30.683237	\N	\N
306	1	1000	300		2024-07-07	0	1	1	2024-08-05 09:46:30.683237	\N	\N
307	7	3000	0		2024-07-08	0	1	1	2024-08-05 09:46:30.683237	\N	\N
308	1	0	0	ME HABIBI	2024-07-08	0	1	1	2024-08-05 09:46:30.683237	\N	\N
309	1	800	300		2024-07-09	0	1	1	2024-08-05 09:46:30.683237	\N	\N
310	1	1000	300		2024-07-09	0	1	1	2024-08-05 09:46:30.683237	\N	\N
311	5	700	300		2024-07-09	0	1	1	2024-08-05 09:46:30.683237	\N	\N
312	1	1000	300		2024-07-10	0	1	1	2024-08-05 09:46:30.683237	\N	\N
313	4	1700	0		2024-07-10	0	1	1	2024-08-05 09:46:30.683237	\N	\N
314	2	0	0	 80 USDT	2024-07-10	0	1	1	2024-08-05 09:46:30.683237	\N	\N
315	2	1000	-100	1+ FOR FREE FOR YESTERDAY	2024-07-11	0	1	1	2024-08-05 09:46:30.683237	\N	\N
316	1	800	300		2024-07-11	0	1	1	2024-08-05 09:46:30.683237	\N	\N
347	2	1600	300		2024-07-18	0	1	1	2024-08-05 09:46:30.683237	\N	\N
348	1	1000	300		2024-07-18	0	1	1	2024-08-05 09:46:30.683237	\N	\N
349	2	1500	300		2024-07-18	0	1	1	2024-08-05 09:46:30.683237	\N	\N
350	2	1600	300		2024-07-18	0	1	1	2024-08-05 09:46:30.683237	\N	\N
351	1	0	0		2024-07-18	0	1	1	2024-08-05 09:46:30.683237	\N	\N
352	1	1700	300		2024-07-19	0	1	1	2024-08-05 09:46:30.683237	\N	\N
353	5	2000	0		2024-07-19	0	1	1	2024-08-05 09:46:30.683237	\N	\N
354	1	1000	300		2024-07-19	0	1	1	2024-08-05 09:46:30.683237	\N	\N
355	1	1000	300		2024-07-20	0	1	1	2024-08-05 09:46:30.683237	\N	\N
356	2	1600	300		2024-07-20	0	1	1	2024-08-05 09:46:30.683237	\N	\N
357	1	1000	300		2024-07-20	0	1	1	2024-08-05 09:46:30.683237	\N	\N
358	1	0	0		2024-07-20	0	1	1	2024-08-05 09:46:30.683237	\N	\N
359	1	1000	300		2024-07-21	0	1	1	2024-08-05 09:46:30.683237	\N	\N
360	5	0	300		2024-07-21	0	1	1	2024-08-05 09:46:30.683237	\N	\N
361	2	1600	300		2024-07-21	0	1	1	2024-08-05 09:46:30.683237	\N	\N
362	7	0	0	faktura till 26.07	2024-07-21	0	1	1	2024-08-05 09:46:30.683237	\N	\N
363	5	0	300		2024-07-22	0	1	1	2024-08-05 09:46:30.683237	\N	\N
364	2	1600	300		2024-07-22	0	1	1	2024-08-05 09:46:30.683237	\N	\N
365	1	1000	300		2024-07-24	0	1	1	2024-08-05 09:46:30.683237	\N	\N
366	1	1000	300		2024-07-24	0	1	1	2024-08-05 09:46:30.683237	\N	\N
367	3	2400	300		2024-07-24	0	1	1	2024-08-05 09:46:30.683237	\N	\N
368	1	1000	300		2024-07-25	0	1	1	2024-08-05 09:46:30.683237	\N	\N
369	1	1000	300		2024-07-25	0	1	1	2024-08-05 09:46:30.683237	\N	\N
370	10	6000	300		2024-07-25	0	1	1	2024-08-05 09:46:30.683237	\N	\N
371	2	1800	300		2024-07-25	0	1	1	2024-08-05 09:46:30.683237	\N	\N
372	3	2400	300		2024-07-25	0	1	1	2024-08-05 09:46:30.683237	\N	\N
373	2	6000	300		2024-07-25	0	1	1	2024-08-05 09:46:30.683237	\N	\N
374	0	-15000	300		2024-07-26	0	1	1	2024-08-05 09:46:30.683237	\N	\N
375	0	10000	300		2024-07-26	0	1	1	2024-08-05 09:46:30.683237	\N	\N
376	1	1000	300		2024-07-26	0	1	1	2024-08-05 09:46:30.683237	\N	\N
377	3	0	300	3ban 2min 200EUR	2024-07-26	0	1	1	2024-08-05 09:46:30.683237	\N	\N
378	3	2500	300		2024-07-26	0	1	1	2024-08-05 09:46:30.683237	\N	\N
379	3	1500	300		2024-07-26	0	1	1	2024-08-05 09:46:30.683237	\N	\N
380	2	1600	300		2024-07-26	0	1	1	2024-08-05 09:46:30.683237	\N	\N
381	3	2400	300		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
382	0	-9500	300		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
383	1	1000	300		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
384	1	1000	300		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
385	1	1000	300		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
386	2	0	300		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
387	1	1000	300		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
388	2	1500	300		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
389	5	2000	0		2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
390	1	0	0	habibi	2024-07-27	0	1	1	2024-08-05 09:46:30.683237	\N	\N
391	1	1000	300		2024-07-28	0	1	1	2024-08-05 09:46:30.683237	\N	\N
392	0	-16800	300	29.07 ap 16800 +200eu left 17min	2024-07-28	0	1	1	2024-08-05 09:46:30.683237	\N	\N
393	1	1000	300		2024-07-29	0	1	1	2024-08-05 09:46:30.683237	\N	\N
394	1	1000	300		2024-07-30	0	1	1	2024-08-05 09:46:30.683237	\N	\N
395	2	1600	300		2024-07-31	0	1	1	2024-08-05 09:46:30.683237	\N	\N
396	1	1000	300		2024-07-31	0	1	1	2024-08-05 09:46:30.683237	\N	\N
397	1	17500	300		2024-07-31	0	1	1	2024-08-05 09:46:30.683237	\N	\N
398	1	800	300		2024-07-31	0	1	1	2024-08-05 09:46:30.683237	\N	\N
399	1	800	300		2024-07-31	0	1	1	2024-08-05 09:46:30.683237	\N	\N
400	1	700	300		2024-07-31	0	1	1	2024-08-05 09:46:30.683237	\N	\N
401	1	0	0	HABIBI	2024-07-31	0	1	1	2024-08-05 09:46:30.683237	\N	\N
402	3	2500	300		2024-08-01	0	1	1	2024-08-05 09:46:30.683237	\N	\N
403	2	1800	300	\N	2024-08-01	0	1	1	2024-08-05 09:46:30.683237	\N	\N
406	1	1000	300	\N	2024-08-02	0	1	1	2024-08-05 09:46:30.683237	\N	\N
409	2	1600	300	\N	2024-08-03	0	1	1	2024-08-05 09:46:30.683237	\N	\N
411	5	7000	300	\N	2024-08-03	0	1	1	2024-08-05 09:46:30.683237	\N	\N
412	2	1500	300	\N	2024-08-03	0	1	1	2024-08-05 09:46:30.683237	\N	\N
413	2	1500	300	\N	2024-08-03	0	1	1	2024-08-05 09:46:30.683237	\N	\N
410	2	2100	300	1ban	2024-08-03	0	1	1	2024-08-05 09:46:30.683237	\N	\N
414	1	0	0	HABIBI	2024-08-02	0	1	1	2024-08-05 09:46:30.683237	\N	\N
415	1	1000	300	\N	2024-08-03	0	1	1	2024-08-05 09:46:30.683237	\N	\N
416	2	1900	300	\N	2024-08-04	0	1	1	2024-08-05 09:46:30.683237	\N	\N
417	1	1000	300	\N	2024-08-04	0	1	1	2024-08-05 09:46:30.683237	\N	\N
418	1	800	300	\N	2024-08-04	0	1	1	2024-08-05 09:46:30.683237	\N	\N
407	2	2000	300	\N	2024-08-02	0	1	1	2024-08-05 09:46:30.683237	\N	\N
408	1	1000	300	\N	2024-08-02	0	1	1	2024-08-05 09:46:30.683237	\N	\N
317	2	1600	300		2024-07-11	0	1	1	2024-08-05 09:46:30.683237	\N	\N
318	2	600	300	+80EUR	2024-07-11	0	1	1	2024-08-05 09:46:30.683237	\N	\N
319	1	1000	300		2024-07-12	0	1	1	2024-08-05 09:46:30.683237	\N	\N
320	3	2500	300		2024-07-12	0	1	1	2024-08-05 09:46:30.683237	\N	\N
321	1	900	300		2024-07-12	0	1	1	2024-08-05 09:46:30.683237	\N	\N
322	1	800	300		2024-07-12	0	1	1	2024-08-05 09:46:30.683237	\N	\N
323	2	0	300		2024-07-12	0	1	1	2024-08-05 09:46:30.683237	\N	\N
324	1	0	300	80EUR	2024-07-12	0	1	1	2024-08-05 09:46:30.683237	\N	\N
325	1	800	300		2024-07-13	0	1	1	2024-08-05 09:46:30.683237	\N	\N
326	3	0	300		2024-07-13	0	1	1	2024-08-05 09:46:30.683237	\N	\N
327	7	4000	300		2024-07-13	0	1	1	2024-08-05 09:46:30.683237	\N	\N
328	3	0	300		2024-07-13	0	1	1	2024-08-05 09:46:30.683237	\N	\N
329	1	0	0	HABIBI	2024-07-13	0	1	1	2024-08-05 09:46:30.683237	\N	\N
330	5	2000	0		2024-07-13	0	1	1	2024-08-05 09:46:30.683237	\N	\N
331	1	1000	300		2024-07-14	0	1	1	2024-08-05 09:46:30.683237	\N	\N
332	1	800	300		2024-07-14	0	1	1	2024-08-05 09:46:30.683237	\N	\N
333	1	1000	300		2024-07-14	0	1	1	2024-08-05 09:46:30.683237	\N	\N
334	3	2500	300		2024-07-14	0	1	1	2024-08-05 09:46:30.683237	\N	\N
335	5	3000	300		2024-07-14	0	1	1	2024-08-05 09:46:30.683237	\N	\N
336	3	2500	300		2024-07-14	0	1	1	2024-08-05 09:46:30.683237	\N	\N
337	1	0	300		2024-07-14	0	1	1	2024-08-05 09:46:30.683237	\N	\N
338	8	3000	0		2024-07-15	0	1	1	2024-08-05 09:46:30.683237	\N	\N
339	2	1600	300		2024-07-15	0	1	1	2024-08-05 09:46:30.683237	\N	\N
340	2	1600	300		2024-07-15	0	1	1	2024-08-05 09:46:30.683237	\N	\N
341	1	0	0	habibi	2024-07-15	0	1	1	2024-08-05 09:46:30.683237	\N	\N
342	3	2400	300		2024-07-16	0	1	1	2024-08-05 09:46:30.683237	\N	\N
343	1	1000	300		2024-07-16	0	1	1	2024-08-05 09:46:30.683237	\N	\N
344	6	3000	300		2024-07-16	0	1	1	2024-08-05 09:46:30.683237	\N	\N
345	0	-3000	300	take ap drop 3000	2024-07-17	0	1	1	2024-08-05 09:46:30.683237	\N	\N
346	10	0	300		2024-07-17	0	1	1	2024-08-05 09:46:30.683237	\N	\N
\.


--
-- Data for Name: vendor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vendor (id, name, contact_info) FROM stdin;
1	Dexter	\N
\.


--
-- Name: driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.driver_id_seq', 1, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 418, true);


--
-- Name: vendor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vendor_id_seq', 1, false);


--
-- Name: driver driver_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.driver
    ADD CONSTRAINT driver_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: vendor vendor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (id);


--
-- Name: orders orders_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.driver(id);


--
-- Name: orders orders_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendor(id);


--
-- PostgreSQL database dump complete
--

