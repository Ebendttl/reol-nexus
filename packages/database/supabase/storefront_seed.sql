-- Storefront Seed Script for REOL Nexus
-- Run this after running 20260630000000_initial_schema.sql and 20260630000001_public_storefront.sql

DO $$
DECLARE
  v_event_center_id uuid;
  v_eatery_id uuid;
  v_laundry_id uuid;
BEGIN
  -- 1. Resolve business unit IDs based on their slugs
  SELECT id INTO v_event_center_id FROM public.business_units WHERE slug = 'event-center' LIMIT 1;
  SELECT id INTO v_eatery_id FROM public.business_units WHERE slug = 'eatery' LIMIT 1;
  SELECT id INTO v_laundry_id FROM public.business_units WHERE slug = 'laundry' LIMIT 1;

  -- Verify that the business units exist
  IF v_event_center_id IS NULL THEN
    RAISE NOTICE 'Event Center business unit not found. Please onboarding/initialize organization first.';
  ELSE
    RAISE NOTICE 'Found Event Center: %', v_event_center_id;
  END IF;

  ------------------------------------------------------------------------------
  -- SEED EVENT CENTER DATA
  ------------------------------------------------------------------------------
  IF v_event_center_id IS NOT NULL THEN
    -- Clear existing event packages/terms/testimonials/gallery for this unit
    DELETE FROM public.event_packages WHERE business_unit_id = v_event_center_id;
    DELETE FROM public.event_terms WHERE business_unit_id = v_event_center_id;

    -- Event Packages
    INSERT INTO public.event_packages (business_unit_id, name, hall_name, capacity, price_from, description, inclusions, image_url, display_order, is_active)
    VALUES
      (
        v_event_center_id,
        'Silver Celebration Package',
        'Lounge & Terrace (Hall B)',
        120,
        750000.00,
        'Perfect for intimate gatherings, bridal showers, birthdays, and private corporate dinners. Offers access to the indoor lounge and open-air garden terrace.',
        '["5 Hours Event Duration", "Standard Ambient & Stage Lighting", "Lounge Furniture & High Tables", "Dedicated Venue Supervisor", "Full Air Conditioning", "Backup Power Generator Standby"]'::jsonb,
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
        1,
        true
      ),
      (
        v_event_center_id,
        'Gold Royale Package',
        'Grand Banquet Hall (Hall A)',
        400,
        1800000.00,
        'Our signature package tailored for weddings, corporate gala dinners, award nights, and major celebrations. Includes banquet setup and full amenities.',
        '["8 Hours Event Duration", "Full Stage Setup & Trussing", "Premium Sound & Lighting Console", "Round Banquet Tables & Premium Chairs", "VIP Green Rooms / Changing Suites", "Professional In-House Security", "Dedicated Car Park (100+ slots)", "Uninterrupted Power Supply"]'::jsonb,
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1200',
        2,
        true
      ),
      (
        v_event_center_id,
        'Platinum Elite Package',
        'Unified Grand Pavilion (Full Venue)',
        800,
        3200000.00,
        'The ultimate luxury event experience featuring full venue takeover. Combines the Grand Ballroom, Garden Terrace, and Outdoor Pavilions for large-scale concerts, festivals, or elite societal weddings.',
        '["12 Hours Full Day Access", "Full Venue Takeover (Indoor & Outdoor)", "Concert-Grade Sound & Intelligent Lighting", "Customizable VIP Holding Lounges", "Dedicated Event Coordinator Team", "Armed Security Escorts & Traffic Controllers", "Valet Parking Service", "Unlimited High-Speed Wi-Fi", "Premium Janitorial Staff Site-wide"]'::jsonb,
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
        3,
        true
      );

    -- Event Terms & Conditions
    INSERT INTO public.event_terms (business_unit_id, title, content, display_order)
    VALUES
      (
        v_event_center_id,
        'Booking & Deposit Policy',
        'A non-refundable commitment deposit of 50% of the total quote is required to secure the hall booking date. The remaining 50% balance must be fully paid and cleared at least 14 working days prior to the event date. Bookings made within 14 days of the event must be paid in full at the time of reservation.',
        1
      ),
      (
        v_event_center_id,
        'Cancellation & Rescheduling',
        'Cancellations made 30 days or more prior to the event will forfeit the initial 50% deposit. Cancellations within 14 days will forfeit 100% of the contract value. Rescheduling is allowed once, free of charge, if requested at least 45 days prior, subject to hall availability. Any subsequent rescheduling attracts a fee of NGN 150,000.',
        2
      ),
      (
        v_event_center_id,
        'Decor & External Vendors',
        'To maintain our premium facility standards, only certified event decorators and caterers are permitted to operate on-site. External vendors must register with the venue management and sign the Vendor Code of Conduct. Noise thresholds must comply with Lagos State Environmental Protection Agency (LASEPA) limits.',
        3
      ),
      (
        v_event_center_id,
        'Caution Deposit & Damages',
        'A refundable Caution Deposit of NGN 150,000 is required for all bookings. This deposit serves as security for any damages to the facility, fixtures, or sound/lighting systems. Post-event inspections are conducted jointly, and the deposit is refunded within 5 business days if no damages or policy infractions are recorded.',
        4
      );
  END IF;

  ------------------------------------------------------------------------------
  -- SEED EATERY DATA
  ------------------------------------------------------------------------------
  IF v_eatery_id IS NOT NULL THEN
    -- Clear existing menu items for this unit
    DELETE FROM public.menu_items WHERE business_unit_id = v_eatery_id;

    -- Menu Items
    INSERT INTO public.menu_items (business_unit_id, name, price, category, description, dietary_tags, is_featured, display_order, is_active)
    VALUES
      (
        v_eatery_id,
        'Signature Smokey Jollof Rice',
        4500.00,
        'Mains',
        'Rich, firewood-infused smokey jollof rice served with sweet plantains, side salad, and your choice of flame-grilled peppered chicken or beef.',
        '["Spicy", "Chef Special"]'::jsonb,
        true,
        1,
        true
      ),
      (
        v_eatery_id,
        'REOL Royal Grill Platter',
        12500.00,
        'Specials',
        'A decadent combination of grilled giant tiger prawns, spicy suya beef strips, chicken wings, sweet potato wedges, corn on the cob, and house garlic dip.',
        '["Gluten-Free", "High-Protein"]'::jsonb,
        true,
        2,
        true
      ),
      (
        v_eatery_id,
        'Fiery Peppered Gizzard & Plantain',
        3800.00,
        'Starters',
        'Crispy fried sweet plantains (dodo) tossed with tender, spiced chicken gizzard in a hot, chunky bell pepper and habanero reduction.',
        '["Very Spicy"]'::jsonb,
        false,
        3,
        true
      ),
      (
        v_eatery_id,
        'Traditional Efo Riro with Assorted Meat',
        6500.00,
        'Mains',
        'Rich, authentic Yoruba spinach stew prepared with locust beans (iru), shaki, beef, ponmo, dry fish, and served with fluffy pounded yam or semovita.',
        '["Traditional"]'::jsonb,
        false,
        4,
        true
      ),
      (
        v_eatery_id,
        'Tropical Zobo Infusion Cooler',
        1800.00,
        'Drinks',
        'Slow-brewed red hibiscus flower infusion, sweetened with organic pineapple juice, spiced with root ginger, cloves, and garnished with fresh mint.',
        '["Organic", "Vegan"]'::jsonb,
        false,
        5,
        true
      ),
      (
        v_eatery_id,
        'Crisp Suya Caesar Salad',
        5200.00,
        'Starters',
        'Fresh Romaine lettuce, crunchy garlic croutons, and shaved parmesan cheese, topped with spicy flame-grilled chicken suya strips and creamy Caesar dressing.',
        '["Spicy"]'::jsonb,
        false,
        6,
        true
      );
  END IF;

  ------------------------------------------------------------------------------
  -- SEED LAUNDRY DATA
  ------------------------------------------------------------------------------
  IF v_laundry_id IS NOT NULL THEN
    -- Clear existing laundry services/deals for this unit
    DELETE FROM public.laundry_services WHERE business_unit_id = v_laundry_id;
    DELETE FROM public.deals_promotions WHERE business_unit_id = v_laundry_id;

    -- Laundry Services
    INSERT INTO public.laundry_services (business_unit_id, name, description, turnaround_time, price_from, image_url, display_order, is_active)
    VALUES
      (
        v_laundry_id,
        'Wash & Fold Everyday Clean',
        'Ideal for everyday apparel: t-shirts, jeans, shorts, underwear, and gym wears. Clothes are color-sorted, washed with premium detergents, tumble-dried, and neatly folded.',
        '24 Hours',
        2500.00,
        'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800',
        1,
        true
      ),
      (
        v_laundry_id,
        'Premium Dry Cleaning & Pressing',
        'Specialized delicate treatment for suits, blazers, evening gowns, wedding dresses, and traditional native garments (Agbadas, Kaftans). Stains are pre-treated, and clothes are pressed to crisp perfection.',
        '48 Hours',
        5000.00,
        'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&q=80&w=800',
        2,
        true
      ),
      (
        v_laundry_id,
        'Express Same-Day Wash & Iron',
        'In a hurry for a meeting or flight? Drop off your garments before 10 AM, and pick them up freshly washed, steamed, ironed, and on hangers in less than 6 hours.',
        '6 Hours',
        7500.00,
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
        3,
        true
      ),
      (
        v_laundry_id,
        'Bulk Institutional/Corporate Plan',
        'Comprehensive linen and laundry solutions for local boutique hotels, shortlet operators, fine dining restaurants, spas, and gyms. Weekly scheduled pickup and delivery included.',
        'Flexible Scheduling',
        25000.00,
        'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=800',
        4,
        true
      );

    -- Deals & Promotions
    INSERT INTO public.deals_promotions (business_unit_id, title, description, discount_label, is_active)
    VALUES
      (
        v_laundry_id,
        'First Wash Welcome Deal',
        'Experience the REOL difference. Get 20% off your very first laundry or dry cleaning request with us.',
        '20% OFF',
        true
      ),
      (
        v_laundry_id,
        'Mid-Week Agbada Special',
        'Bring in 3 Agbadas or Kaftans for dry cleaning on Tuesdays or Wednesdays, and get the 4th cleaned free!',
        '4TH FOR FREE',
        true
      );
  END IF;

  ------------------------------------------------------------------------------
  -- SEED SHARED/CROSS-UNIT DATA (TESTIMONIALS & GALLERY IMAGES)
  ------------------------------------------------------------------------------
  -- Clear existing testimonials & gallery images
  DELETE FROM public.testimonials;
  DELETE FROM public.gallery_images;

  -- Testimonials
  INSERT INTO public.testimonials (business_unit_id, author_name, content, rating, is_featured)
  VALUES
    (v_event_center_id, 'Mrs. Toyin Adebayo', 'We hosted our corporate end-of-year dinner at the REOL Event Center. The facility is world-class, the AC was ice cold, and the backup generators kicked in within seconds during power fluctuations. Excellent service and support!', 5, true),
    (v_eatery_id, 'Femi Olowu (Lagos Foodie)', 'I''m extremely picky with Jollof, but REOL Eatery''s smokey jollof has won me over. Their firewood flavor is authentic, the portions are massive, and the suya platter was beautifully grilled. Highly recommended!', 5, true),
    (v_laundry_id, 'Chiamaka Nze', 'Best dry cleaners in Lagos! I brought in a heavily stained white silk kaftan that I thought was ruined. They returned it looking absolutely pristine. Turnaround times are highly reliable, and staff are incredibly polite.', 5, true);

  -- Gallery Images
  INSERT INTO public.gallery_images (business_unit_id, image_url, caption, display_order)
  VALUES
    (v_event_center_id, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', 'Grand Banquet Hall wedding reception setup', 1),
    (v_event_center_id, 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800', 'Corporate gala dinner banquet layout', 2),
    (v_eatery_id, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', 'Signature grill platter at the Eatery dining room', 3),
    (v_laundry_id, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800', 'Garments packaged and prepped for home delivery', 4);

END $$;

--------------------------------------------------------------------------------
-- SEED COMING SOON DATA (No business_unit_id constraint)
--------------------------------------------------------------------------------
-- Clear existing coming soon units
DELETE FROM public.coming_soon_units;

INSERT INTO public.coming_soon_units (name, description, icon, expected_launch_label, display_order)
VALUES
  (
    'REOL Shortlet Suites',
    'Luxury 1 & 2 bedroom boutique suites located on the upper floors. Offering 24/7 solar + grid power, high-security fingerprint locks, private workspace, superfast fiber internet, and premium concierge service.',
    'Home',
    'Opening Q3 2026',
    1
  ),
  (
    'Nexus Auto Spa & Detailers',
    'Professional high-pressure touchless washing, engine steam cleaning, internal leather detailing, and premium hydrophobic waxing. Have your car detailed while you dine at the Eatery or attend an event.',
    'Car',
    'Launching Q4 2026',
    2
  ),
  (
    'REOL Express Mini-Mart',
    'Your 24/7 convenience hub under our roof. Stocked with premium beverages, snacks, daily essentials, toiletries, and high-quality local and imported groceries for quick grab-and-go convenience.',
    'ShoppingBag',
    'Opening Q1 2027',
    3
  );
