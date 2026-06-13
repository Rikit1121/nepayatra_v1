-- ============================================================
-- Migration : 20260613000004_local_hero_images
-- Purpose   : Point destinations/packages at uploaded /public/images assets
-- ============================================================

update public.destinations set hero_image_url = '/images/Kathmandu.jpg' where slug = 'kathmandu';
update public.destinations set hero_image_url = '/images/Bhaktapur.jpg' where slug = 'bhaktapur';
update public.destinations set hero_image_url = '/images/Patan.jpg' where slug = 'patan';
update public.destinations set hero_image_url = '/images/pokhara.jpg' where slug = 'pokhara';
update public.destinations set hero_image_url = '/images/Chitwan.jpg' where slug = 'chitwan';
update public.destinations set hero_image_url = '/images/Janakpur-Temple.jpg' where slug = 'janakpur';
update public.destinations set hero_image_url = '/images/Lumbini.jpg' where slug = 'lumbini';
update public.destinations set hero_image_url = '/images/Dhulikhel.jpg' where slug = 'dhulikhel';
update public.destinations set hero_image_url = '/images/Bandipur.jpg' where slug = 'bandipur';
update public.destinations set hero_image_url = '/images/sarangkot.webp' where slug = 'sarangkot';
update public.destinations set hero_image_url = '/images/rara-lake.jpg' where slug = 'rara-lake';
update public.destinations set hero_image_url = '/images/The_Muktinath_Temple.jpg' where slug = 'muktinath';
update public.destinations set hero_image_url = '/images/Pashupatinath.webp' where slug = 'pashupatinath';
update public.destinations set hero_image_url = '/images/MUSTANG-NEPAL.jpg' where slug = 'mustang';
update public.destinations set hero_image_url = '/images/manang.avif' where slug = 'manang';
update public.destinations set hero_image_url = '/images/bardiya.jpg' where slug = 'bardia-national-park';
update public.destinations set hero_image_url = '/images/birgunj.jpeg' where slug = 'birgunj';
update public.destinations set hero_image_url = '/images/Annapurna-base-camp-trek-8-days.jpg' where slug = 'annapurna-base-camp';
update public.destinations set hero_image_url = '/images/nagarkot.jpg' where slug = 'nagarkot';
update public.destinations set hero_image_url = '/images/ilam.jpg' where slug = 'ilam';
update public.destinations set hero_image_url = '/images/ghandruk.jpg' where slug = 'ghandruk';

update public.packages set hero_image_url = '/images/Kathmandu.jpg' where slug = 'golden-triangle-nepal';
update public.packages set hero_image_url = '/images/Annapurna-base-camp-trek-8-days.jpg' where slug = 'annapurna-base-camp-trek';
update public.packages set hero_image_url = '/images/Pashupatinath.webp' where slug = 'nepal-pilgrimage-circuit';
update public.packages set hero_image_url = '/images/MUSTANG-NEPAL.jpg' where slug = 'upper-mustang-expedition';

update public.site_settings
set setting_value = '/images/sarangkot.webp'
where setting_key = 'homepage_hero_image_url';

insert into public.site_settings (setting_key, setting_value, value_type, setting_group)
values ('homepage_hero_image_url', '/images/sarangkot.webp', 'image_url', 'homepage')
on conflict (setting_key) do update
  set setting_value = excluded.setting_value;
