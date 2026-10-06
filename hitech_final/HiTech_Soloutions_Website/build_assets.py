from PIL import Image,ImageOps,ImageDraw,ImageFont
from pathlib import Path
src=Path('/mnt/data'); out=Path('/mnt/data/HiTech_Soloutions_Website/assets')
# Compositions intentionally crop existing user-approved campaign illustrations so headlines are rendered in HTML, not duplicated in the image.
crops={
 'hero-light':('meet_your_pocket_printer.png',(430,525,1100,1100)),
 'hero-dark':('pocket_printer_premium_vibes.png',(140,555,1105,1080)),
 'product-main':('meet_your_pocket_printer.png',(430,525,1100,1100)),
 'product-night':('pocket_printer_premium_vibes.png',(175,560,1090,1040)),
 'use-study':('hitech_study_smarter_desk_setup.png',(35,470,1090,1200)),
 'use-kitchen':('kitchen_calm_a_tidy_pantry.png',(80,495,1100,1250)),
 'use-business':('small_tool_smart_business.png',(35,440,1090,1150)),
 'use-memories':('memory_wall_print_moments_keep_them_close.png',(35,515,1100,1230)),
 'use-gift':('gift_something_smart_hitech_mini_printer.png',(65,390,1060,1130)),
 'use-creative':('pastel_mini_printer_journaling_setup.png',(30,445,1100,1185)),
 'use-planner':('plan_better_with_hitech.png',(20,480,1100,1180)),
 'use-cables':('desk_clear_smart_cable_organization.png',(35,500,1100,1170)),
 'use-bundle':('brand_better_premium_thank_you_packaging.png',(35,415,1090,1170)),
 'use-pet':('pet_station_sorted.png',(45,540,1100,1210)),
 'use-party':('party_ready_with_hitech_printer.png',(30,465,1090,1190)),
 'use-teacher':('teacher_ready_classroom_organization.png',(35,465,1100,1160)),
 'use-organize':('stock_clear_organize_smarter.png',(20,465,1100,1240)),
 'use-travel':('trip_sorted_travel_made_easy.png',(60,455,1095,1175)),
 'use-paper':('print_without_ink.png',(350,455,1100,1140))
}
for name,(fn,region) in crops.items():
 im=Image.open(src/fn).convert('RGB').crop(region)
 maxwidth=1050 if name.startswith('hero') else 850
 if im.width>maxwidth:
  im.resize((maxwidth, round(im.height*maxwidth/im.width)),Image.Resampling.LANCZOS)
 im.save(out/(name+'.webp'),format='WEBP',quality=83,method=6)
 print(name, (out/(name+'.webp')).stat().st_size)
# overview contact sheet for selecting images
thumb_w,thumb_h=260,190
canvas=Image.new('RGB',(thumb_w*4,245*5),'#eaeaea');d=ImageDraw.Draw(canvas)
for i,name in enumerate(crops):
 im=Image.open(out/(name+'.webp')); thumb=ImageOps.fit(im,(thumb_w,thumb_h))
 x=(i%4)*thumb_w; y=(i//4)*245
 canvas.paste(thumb,(x,y));d.text((x+8,y+197),name,fill='black')
canvas.save(out/'asset-contact-sheet.jpg',quality=75)
