update public.products
set name = 'Slim Mattress'
where slug = 'shim-mattress';

update public.product_images
set alt_text = replace(alt_text, 'Shim Mattress', 'Slim Mattress')
where product_id = (
  select id from public.products where slug = 'shim-mattress'
);
