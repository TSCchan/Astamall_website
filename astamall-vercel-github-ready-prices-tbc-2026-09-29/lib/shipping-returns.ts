/**
 * The ASTAMALL Shipping, Returns & Refund Policy, in English and Bahasa Malaysia. Layout and conventions: see
 * lib/legal.ts. Section numbers drive the anchor IDs (#section-8), so a reader who switches language lands on the
 * matching section; the same number must mean the same section in both languages.
 */

import { checkLegalDocument, type LegalDocuments } from '@/lib/legal';

export const shippingReturns: LegalDocuments = {
  en: {
    lang: 'en-MY',
    ogLocale: 'en_MY',
    path: '/shipping-returns',
    title: 'Shipping, Returns & Refund Policy',
    description: 'How ASTAMALL processes and delivers orders within Malaysia, and how returns, refunds and cancellations are handled.',
    updatedLabel: 'Last updated',
    updated: '29 October 2026',
    updatedDate: '2026-10-29',
    meta: [
      [
        "Business Name",
        "ASTA MALL PLT"
      ],
      [
        "Business Registration Number",
        "202604002255"
      ],
      [
        "Website",
        "https://www.astamall.com.my"
      ],
      [
        "Contact Email",
        "astamall92@gmail.com"
      ]
    ],
    contentsLabel: 'Contents',
    languageLabel: 'Language',
    languageName: 'English',
    sections: [
      {
        "number": 1,
        "title": "Introduction",
        "blocks": [
          "Welcome to ASTAMALL.",
          "At ASTAMALL, we are committed to providing a reliable, transparent and enjoyable shopping experience.",
          "We take care in selecting, handling and packaging our beauty, skincare, personal care and wellness products to help ensure that they reach our customers in good condition.",
          "This Shipping, Returns & Refund Policy explains how orders are processed and delivered, when returns or refunds may be requested, and how we handle order-related concerns.",
          "By purchasing through our website, you acknowledge this Policy, subject always to your rights under applicable Malaysian laws."
        ]
      },
      {
        "number": 2,
        "title": "Shipping Coverage",
        "blocks": [
          "ASTAMALL offers delivery to eligible addresses within Malaysia, including Peninsular Malaysia, Sabah and Sarawak, subject to courier availability and any restrictions indicated at checkout.",
          "Shipping availability, methods and charges will be displayed during checkout before payment confirmation.",
          "International shipping is not currently offered unless expressly made available through our website."
        ]
      },
      {
        "number": 3,
        "title": "Order Processing",
        "blocks": [
          "Orders are generally processed within **1–3 working days** after successful payment verification.",
          "Working days exclude Saturdays, Sundays and Malaysian public holidays.",
          "Please note:",
          {
            "list": [
              "Orders placed during weekends or public holidays will normally be processed on the next working day.",
              "Orders may require additional processing time during major sales, festive seasons or periods of high demand.",
              "Pre-order items, if offered, will follow their stated fulfilment schedules.",
              "If a product becomes unavailable after purchase, we will contact you to discuss a replacement, revised delivery arrangement or refund, as appropriate."
            ]
          },
          "Order processing time does not include courier transit time."
        ]
      },
      {
        "number": 4,
        "title": "Estimated Delivery Time",
        "blocks": [
          "Estimated delivery periods after dispatch are as follows:",
          {
            "table": {
              "head": [
                "Delivery Region",
                "Estimated Transit Time"
              ],
              "rows": [
                [
                  "Peninsular Malaysia",
                  "2–5 working days"
                ],
                [
                  "Sabah & Sarawak",
                  "5–10 working days"
                ],
                [
                  "Remote or restricted areas",
                  "May require additional time"
                ]
              ]
            }
          },
          "These estimates are provided for general guidance and are not guaranteed delivery dates.",
          "Actual delivery times may vary due to courier operations, weather conditions, festive congestion, public holidays, logistical disruptions or circumstances outside our reasonable control.",
          "Where an order is significantly delayed, ASTAMALL will assist with delivery enquiries and provide appropriate remedies where required by law."
        ]
      },
      {
        "number": 5,
        "title": "Shipping Fees",
        "blocks": [
          "Shipping fees are calculated based on the delivery destination, parcel weight, applicable shipping method and any available promotions.",
          "The total shipping fee will be clearly displayed at checkout before payment.",
          "Free-shipping offers, if available, may be subject to minimum spending requirements, promotional periods or geographical restrictions.",
          "Additional delivery charges will not be imposed after checkout without the customer's agreement, except where a revised delivery arrangement is separately authorised."
        ]
      },
      {
        "number": 6,
        "title": "Order Confirmation and Tracking",
        "blocks": [
          "After successfully placing an order, customers will receive an order acknowledgement through the contact details provided.",
          "Once the order has been dispatched, tracking information will be provided where available.",
          "Customers may use the tracking details to monitor delivery progress.",
          "If you experience difficulty tracking your parcel, please contact **astamall92@gmail.com** with your order number."
        ]
      },
      {
        "number": 7,
        "title": "Incorrect Shipping Information and Failed Delivery",
        "blocks": [
          "Customers are responsible for providing complete and accurate delivery information, including the recipient's name, contact number, postal address and postcode.",
          "If you notice an error in your delivery details, please contact us as soon as possible.",
          "We will make reasonable efforts to accommodate corrections, although changes may not be possible after dispatch.",
          "If delivery fails because of an incorrect address provided by the customer, an unavailable recipient or repeated unsuccessful delivery attempts, additional redelivery costs may apply. Any applicable charges will be communicated before a new delivery arrangement is confirmed.",
          "This provision does not apply where delivery failure is attributable to ASTAMALL or its fulfilment arrangements."
        ]
      },
      {
        "number": 8,
        "title": "Returns and Refund Eligibility",
        "blocks": [
          "Due to the nature of our cosmetics, lip products, skincare and wellness items, special hygiene and product-safety considerations apply.",
          "ASTAMALL accepts eligible return, replacement or refund requests where:",
          {
            "list": [
              "**Damaged products:** The product arrives broken, leaking or physically damaged.",
              "**Incorrect products:** The customer receives a product, variant, shade or quantity different from the confirmed order.",
              "**Defective products:** The product has a manufacturing defect or fails applicable quality or safety requirements.",
              "**Expired products:** The product has passed its stated expiry date upon delivery.",
              "**Missing items:** One or more paid items are missing from the delivered order.",
              "**Material description mismatch:** The product substantially differs from its advertised description or specifications.",
              "**Other statutory grounds:** A return or refund is required under applicable consumer protection laws."
            ],
            "ordered": true
          },
          "Each request will be assessed based on the relevant circumstances and applicable legal rights."
        ]
      },
      {
        "number": 9,
        "title": "Non-Returnable Items",
        "blocks": [
          "For hygiene, health and product-integrity reasons, ASTAMALL generally does not accept returns or refunds solely due to:",
          {
            "list": [
              "Change of mind after purchase.",
              "Customer preference regarding colour, fragrance, texture or appearance.",
              "Incorrect product or shade selection made by the customer.",
              "Opened, used or unsealed cosmetics, lipsticks, lip balms or skincare products where there is no qualifying defect or other legal basis for return.",
              "Products damaged through improper handling, misuse or storage after delivery.",
              "Dissatisfaction with personal or subjective results where the product is otherwise compliant with its description and applicable quality requirements."
            ]
          },
          "This restriction does not prevent a customer from seeking a legally available remedy for a defective, unsafe, incorrect or materially misdescribed product, even if the product has been opened or used.",
          "Products purchased during promotional campaigns or sales remain covered by applicable consumer rights."
        ]
      },
      {
        "number": 10,
        "title": "How to Request a Return or Refund",
        "blocks": [
          "If you receive a damaged, defective, expired, incorrect or incomplete order, we encourage you to contact us within **7 calendar days of delivery** to facilitate prompt investigation.",
          "This recommended reporting period does not limit or replace any longer period or remedy available under Malaysian law.",
          "Please follow these steps:",
          "**Step 1 — Contact ASTAMALL**",
          "Email **astamall92@gmail.com** with the subject:",
          "\"Return / Refund Request – Order #[Your Order Number]\"",
          "**Step 2 — Provide Order Details**",
          "Please include:",
          {
            "list": [
              "Your order number.",
              "Your name and contact details.",
              "The product name and quantity involved.",
              "A description of the issue.",
              "Clear photos or videos, where reasonably available, showing the product condition, packaging, expiry information or other relevant issue."
            ]
          },
          "**Step 3 — Review**",
          "Our customer service team will review the information and may request reasonable additional details to assess the claim.",
          "**Step 4 — Resolution**",
          "Depending on the circumstances and applicable law, an eligible claim may be resolved through:",
          {
            "list": [
              "Replacement of the affected product.",
              "Supply of a missing or incorrect item.",
              "Full or partial refund, where appropriate.",
              "Another remedy agreed with the customer and permitted by law."
            ]
          },
          "Please contact us before arranging a return so that we can provide the appropriate return instructions. This does not restrict statutory consumer rights."
        ]
      },
      {
        "number": 11,
        "title": "Returning Products",
        "blocks": [
          "Where a physical return is required, ASTAMALL will provide return instructions and the designated return address.",
          "Customers should, where reasonably possible, return the affected product with its original packaging and any relevant accessories.",
          "For products that are defective, damaged or materially misdescribed, opening the packaging for reasonable inspection does not automatically invalidate the customer's rights.",
          "**Return Shipping Costs**",
          "Where goods are defective or materially different from what was ordered, ASTAMALL will bear the applicable return-shipping costs in accordance with Malaysian law.",
          "For any other return voluntarily approved by ASTAMALL, return-shipping arrangements and applicable costs will be communicated before the return proceeds.",
          "Customers should not send products to an unspecified return address without first contacting our team."
        ]
      },
      {
        "number": 12,
        "title": "Refund Processing",
        "blocks": [
          "Once a refund has been approved and any necessary product verification or return has been completed, ASTAMALL aims to initiate the refund within **7–14 working days**.",
          "Where possible, refunds will be made to the original payment method used for the purchase.",
          "If a refund cannot be processed through the original payment channel, we will contact the customer to arrange an appropriate alternative payment method.",
          "The time required for refunded funds to appear in the customer's account may vary depending on the bank, payment gateway or payment service provider.",
          "Where a statutory refund is due, ASTAMALL will not require the customer to accept store credit in place of the refund.",
          "Any applicable refund of original shipping charges will be handled in accordance with the reason for the refund and applicable law."
        ]
      },
      {
        "number": 13,
        "title": "Order Cancellation",
        "blocks": [
          "Customers who wish to cancel or amend an order should contact **astamall92@gmail.com** as soon as possible.",
          "We will make reasonable efforts to accommodate cancellation or modification requests before dispatch.",
          "If an order has already been dispatched, cancellation may no longer be operationally possible, and the applicable return and refund provisions will apply.",
          "If ASTAMALL cancels an order because of unavailable inventory, fulfilment difficulties or another reason attributable to ASTAMALL, the customer will be offered an appropriate resolution, including a refund where applicable."
        ]
      },
      {
        "number": 14,
        "title": "Lost, Delayed or Undelivered Parcels",
        "blocks": [
          "If your parcel has not arrived within the expected delivery period, or tracking information indicates delivery but you have not received the parcel, please notify ASTAMALL.",
          "We will investigate the matter with the relevant courier or fulfilment provider.",
          "Where an order is confirmed lost or undelivered, ASTAMALL will arrange an appropriate remedy, which may include replacement or refund according to the circumstances and applicable law.",
          "Customers are not required to resolve courier-related issues independently before contacting ASTAMALL."
        ]
      },
      {
        "number": 15,
        "title": "Product Safety and Adverse Reactions",
        "blocks": [
          "ASTAMALL encourages customers to read product descriptions, ingredient information, usage instructions and warnings before use.",
          "Individual skin sensitivities, allergies and product experiences may vary.",
          "If irritation or an adverse reaction occurs, discontinue use immediately and seek appropriate medical advice where necessary.",
          "Please contact us if you believe a product may be defective, contaminated, unsafe or incorrectly labelled.",
          "An individual adverse reaction does not automatically establish a product defect, but ASTAMALL will assess relevant complaints fairly and in accordance with applicable product safety and consumer protection laws."
        ]
      },
      {
        "number": 16,
        "title": "Promotional Bundles and Complimentary Items",
        "blocks": [
          "Products purchased as part of a promotional bundle, gift set or discounted package are subject to this Policy.",
          "Where a return or refund affects only part of a bundle, the refund amount will be calculated fairly based on the actual purchase amount, applicable discounts and legal entitlements.",
          "Complimentary samples and gifts generally have no standalone refundable purchase value. This does not affect any rights arising from a defective promotional product or the original purchase."
        ]
      },
      {
        "number": 17,
        "title": "Consumer Rights",
        "blocks": [
          "Nothing in this Policy excludes, restricts or modifies any consumer guarantee, legal right or remedy that cannot lawfully be excluded under the **Consumer Protection Act 1999**, its applicable regulations or other relevant Malaysian laws.",
          "If any provision of this Policy conflicts with mandatory legal requirements, the applicable law will prevail."
        ]
      },
      {
        "number": 18,
        "title": "Policy Updates",
        "blocks": [
          "ASTAMALL may update this Shipping, Returns & Refund Policy from time to time to reflect operational developments, service improvements or changes in legal requirements.",
          "The updated version will be published on our website with its revised effective date.",
          "Changes will not retrospectively remove consumer rights or remedies already arising from completed transactions."
        ]
      },
      {
        "number": 19,
        "title": "Contact Information",
        "blocks": [
          "For shipping enquiries, order cancellations, damaged items, returns or refund requests, please contact:",
          {
            "title": "ASTA MALL PLT",
            "facts": [
              [
                "Business Registration No.",
                "202604002255"
              ],
              [
                "Website",
                "https://www.astamall.com.my"
              ],
              [
                "Email",
                "astamall92@gmail.com"
              ]
            ]
          },
          "We are committed to addressing customer enquiries fairly, professionally and as promptly as reasonably possible."
        ]
      }
    ],
  },
  ms: {
    lang: 'ms-MY',
    ogLocale: 'ms_MY',
    path: '/ms/shipping-returns',
    title: 'Polisi Penghantaran, Pemulangan & Bayaran Balik',
    description: 'Cara ASTAMALL memproses dan menghantar pesanan di Malaysia, serta cara pemulangan, bayaran balik dan pembatalan dikendalikan.',
    updatedLabel: 'Tarikh kemas kini terakhir',
    updated: '29 Oktober 2026',
    updatedDate: '2026-10-29',
    meta: [
      [
        "Nama Perniagaan",
        "ASTA MALL PLT"
      ],
      [
        "No. Pendaftaran Perniagaan",
        "202604002255"
      ],
      [
        "Laman Web",
        "https://www.astamall.com.my"
      ],
      [
        "E-mel",
        "astamall92@gmail.com"
      ]
    ],
    contentsLabel: 'Kandungan',
    languageLabel: 'Bahasa',
    languageName: 'Bahasa Melayu',
    sections: [
      {
        "number": 1,
        "title": "Pengenalan",
        "blocks": [
          "Selamat datang ke ASTAMALL.",
          "Di ASTAMALL, kami komited untuk menyediakan pengalaman membeli-belah dalam talian yang dipercayai, telus dan menyenangkan.",
          "Kami mengutamakan pengendalian dan pembungkusan produk kecantikan, penjagaan kulit, penjagaan diri dan kesejahteraan dengan teliti bagi memastikan produk sampai kepada pelanggan dalam keadaan baik.",
          "Polisi ini menerangkan proses penghantaran pesanan, kelayakan pemulangan produk, prosedur bayaran balik dan cara kami mengendalikan masalah berkaitan pesanan.",
          "Semua pembelian adalah tertakluk kepada polisi ini tanpa menjejaskan hak pengguna di bawah undang-undang Malaysia."
        ]
      },
      {
        "number": 2,
        "title": "Kawasan Penghantaran",
        "blocks": [
          "ASTAMALL menyediakan penghantaran ke alamat yang layak di Malaysia, termasuk Semenanjung Malaysia, Sabah dan Sarawak, tertakluk kepada ketersediaan perkhidmatan kurier.",
          "Kaedah penghantaran dan caj yang berkaitan akan dipaparkan semasa pembayaran.",
          "Penghantaran antarabangsa tidak ditawarkan melainkan dinyatakan secara khusus di laman web kami."
        ]
      },
      {
        "number": 3,
        "title": "Pemprosesan Pesanan",
        "blocks": [
          "Pesanan biasanya diproses dalam tempoh **1–3 hari bekerja** selepas pembayaran berjaya disahkan.",
          "Hari bekerja tidak termasuk hari Sabtu, Ahad dan cuti umum di Malaysia.",
          "Sila ambil perhatian:",
          {
            "list": [
              "Pesanan pada hujung minggu atau cuti umum biasanya diproses pada hari bekerja berikutnya.",
              "Tempoh pemprosesan mungkin lebih panjang semasa promosi besar, musim perayaan atau permintaan tinggi.",
              "Produk prapesanan, jika ditawarkan, tertakluk kepada jadual penghantaran yang dinyatakan.",
              "Jika produk tidak tersedia selepas pembelian, kami akan menghubungi pelanggan untuk menawarkan penyelesaian yang bersesuaian, termasuk penggantian atau bayaran balik."
            ]
          },
          "Tempoh pemprosesan tidak termasuk masa penghantaran kurier."
        ]
      },
      {
        "number": 4,
        "title": "Anggaran Tempoh Penghantaran",
        "blocks": [
          "Anggaran tempoh penghantaran selepas pesanan diserahkan kepada pihak kurier adalah seperti berikut:",
          {
            "table": {
              "head": [
                "Kawasan",
                "Anggaran Tempoh"
              ],
              "rows": [
                [
                  "Semenanjung Malaysia",
                  "2–5 hari bekerja"
                ],
                [
                  "Sabah & Sarawak",
                  "5–10 hari bekerja"
                ],
                [
                  "Kawasan pedalaman atau terhad",
                  "Mungkin memerlukan masa tambahan"
                ]
              ]
            }
          },
          "Tempoh yang dinyatakan merupakan anggaran dan bukan jaminan tarikh penghantaran.",
          "Kelewatan mungkin berlaku akibat operasi kurier, keadaan cuaca, musim perayaan, cuti umum atau gangguan logistik.",
          "Sekiranya berlaku kelewatan yang ketara, ASTAMALL akan membantu menyemak status penghantaran dan menyediakan penyelesaian sewajarnya mengikut undang-undang yang terpakai."
        ]
      },
      {
        "number": 5,
        "title": "Caj Penghantaran",
        "blocks": [
          "Caj penghantaran ditentukan berdasarkan lokasi penerima, berat bungkusan, kaedah penghantaran dan promosi yang tersedia.",
          "Jumlah caj penghantaran akan dipaparkan sebelum pelanggan membuat pembayaran.",
          "Promosi penghantaran percuma, jika ditawarkan, mungkin tertakluk kepada jumlah pembelian minimum, tempoh promosi atau kawasan tertentu.",
          "Tiada caj tambahan akan dikenakan selepas pembayaran tanpa persetujuan pelanggan, kecuali bagi pengaturan penghantaran baharu yang dipersetujui secara berasingan."
        ]
      },
      {
        "number": 6,
        "title": "Pengesahan dan Penjejakan Pesanan",
        "blocks": [
          "Selepas pesanan berjaya dibuat, pelanggan akan menerima pengesahan melalui maklumat hubungan yang diberikan.",
          "Maklumat penjejakan akan disediakan apabila pesanan telah dihantar dan perkhidmatan penjejakan tersedia.",
          "Jika menghadapi masalah menjejaki bungkusan, sila hubungi **astamall92@gmail.com** dengan menyertakan nombor pesanan."
        ]
      },
      {
        "number": 7,
        "title": "Maklumat Penghantaran Tidak Tepat",
        "blocks": [
          "Pelanggan bertanggungjawab memberikan nama penerima, nombor telefon, alamat penghantaran dan poskod yang lengkap dan tepat.",
          "Jika terdapat kesilapan, sila hubungi kami secepat mungkin.",
          "Kami akan berusaha membantu membuat pembetulan, tetapi perubahan alamat mungkin tidak dapat dilakukan selepas pesanan dihantar.",
          "Jika penghantaran gagal akibat alamat yang salah, penerima tidak dapat dihubungi atau percubaan penghantaran yang berulang kali tidak berjaya, caj penghantaran semula mungkin dikenakan.",
          "Sebarang caj tambahan akan dimaklumkan terlebih dahulu.",
          "Peruntukan ini tidak terpakai jika kegagalan penghantaran berpunca daripada ASTAMALL atau pengaturan penghantarannya."
        ]
      },
      {
        "number": 8,
        "title": "Kelayakan Pemulangan dan Bayaran Balik",
        "blocks": [
          "Atas sebab kebersihan, keselamatan dan integriti produk, syarat khas dikenakan terhadap produk kosmetik, penjagaan bibir, penjagaan kulit dan kesejahteraan.",
          "Permohonan pemulangan, penggantian atau bayaran balik boleh dipertimbangkan jika:",
          {
            "list": [
              "**Produk rosak:** Produk diterima dalam keadaan pecah, bocor atau mengalami kerosakan fizikal.",
              "**Produk salah:** Produk, warna, varian atau kuantiti yang diterima tidak sepadan dengan pesanan.",
              "**Produk cacat:** Produk mempunyai kecacatan pembuatan atau tidak memenuhi keperluan kualiti atau keselamatan yang terpakai.",
              "**Produk tamat tempoh:** Produk telah melepasi tarikh luput semasa diterima.",
              "**Item tidak lengkap:** Terdapat item yang telah dibayar tetapi tidak disertakan dalam pesanan.",
              "**Penerangan tidak tepat:** Produk berbeza secara ketara daripada penerangan atau spesifikasi yang diiklankan.",
              "**Hak di bawah undang-undang:** Pemulangan atau bayaran balik diperlukan mengikut undang-undang perlindungan pengguna."
            ],
            "ordered": true
          },
          "Setiap permohonan akan dinilai berdasarkan keadaan sebenar dan hak pengguna yang terpakai."
        ]
      },
      {
        "number": 9,
        "title": "Produk yang Tidak Layak Dipulangkan",
        "blocks": [
          "Atas sebab kebersihan dan keselamatan, ASTAMALL secara amnya tidak menerima pemulangan semata-mata kerana:",
          {
            "list": [
              "Pelanggan berubah fikiran selepas pembelian.",
              "Pelanggan tidak menyukai warna, bau, tekstur atau penampilan produk.",
              "Pelanggan tersalah memilih produk atau warna.",
              "Produk kosmetik, gincu, pelembap bibir atau penjagaan kulit telah dibuka, digunakan atau dibuka meterainya tanpa kecacatan atau alasan pemulangan yang sah.",
              "Produk rosak akibat penyimpanan yang tidak sesuai, salah guna atau kecuaian selepas diterima.",
              "Hasil penggunaan tidak memenuhi jangkaan peribadi sedangkan produk mematuhi penerangan dan keperluan kualiti yang berkenaan."
            ]
          },
          "Walau bagaimanapun, sekatan ini tidak menjejaskan hak pengguna untuk mendapatkan penyelesaian bagi produk yang cacat, tidak selamat, salah dihantar atau mempunyai penerangan yang mengelirukan, termasuk apabila produk telah dibuka atau digunakan.",
          "Produk promosi dan jualan diskaun juga tertakluk kepada hak pengguna di bawah undang-undang."
        ]
      },
      {
        "number": 10,
        "title": "Cara Memohon Pemulangan atau Bayaran Balik",
        "blocks": [
          "Sekiranya produk yang diterima rosak, cacat, tamat tempoh, salah atau tidak lengkap, pelanggan digalakkan menghubungi kami dalam tempoh **7 hari kalendar selepas penerimaan** supaya siasatan dapat dilakukan dengan segera.",
          "Tempoh pelaporan yang disarankan ini tidak mengehadkan hak atau tempoh tuntutan yang diberikan oleh undang-undang Malaysia.",
          "**Langkah 1 — Hubungi ASTAMALL**",
          "E-mel kepada **astamall92@gmail.com** dengan tajuk:",
          "\"Permohonan Pemulangan / Bayaran Balik – Pesanan #[Nombor Pesanan]\"",
          "**Langkah 2 — Sertakan Maklumat**",
          "Sila berikan:",
          {
            "list": [
              "Nombor pesanan.",
              "Nama dan maklumat hubungan.",
              "Nama produk serta kuantiti yang terlibat.",
              "Penerangan mengenai masalah.",
              "Gambar atau video yang jelas, jika tersedia secara munasabah, bagi membantu proses semakan."
            ]
          },
          "**Langkah 3 — Semakan**",
          "Pasukan kami akan menilai permohonan dan mungkin meminta maklumat tambahan yang munasabah.",
          "**Langkah 4 — Penyelesaian**",
          "Bergantung pada keadaan dan undang-undang yang terpakai, penyelesaian boleh merangkumi:",
          {
            "list": [
              "Penggantian produk.",
              "Penghantaran item yang hilang atau salah.",
              "Bayaran balik penuh atau sebahagian, mengikut kesesuaian.",
              "Penyelesaian lain yang dipersetujui dan dibenarkan oleh undang-undang."
            ]
          },
          "Sila hubungi kami sebelum menghantar produk untuk dipulangkan supaya arahan yang sesuai dapat diberikan."
        ]
      },
      {
        "number": 11,
        "title": "Prosedur Pemulangan Produk",
        "blocks": [
          "Jika pemulangan fizikal diperlukan, ASTAMALL akan memberikan arahan dan alamat pemulangan yang ditetapkan.",
          "Pelanggan digalakkan mengembalikan produk bersama pembungkusan asal dan aksesori berkaitan, jika munasabah.",
          "Bagi produk yang rosak, cacat atau mempunyai penerangan yang tidak tepat, pembukaan pembungkusan untuk pemeriksaan yang munasabah tidak secara automatik membatalkan hak pengguna.",
          "**Kos Penghantaran Pemulangan**",
          "Jika produk mempunyai kecacatan atau berbeza secara ketara daripada pesanan, ASTAMALL akan menanggung kos penghantaran pemulangan yang berkenaan selaras dengan undang-undang Malaysia.",
          "Bagi pemulangan lain yang diluluskan secara sukarela, pengaturan serta kos akan dimaklumkan sebelum proses pemulangan dibuat.",
          "Pelanggan tidak sepatutnya menghantar produk ke alamat yang tidak disahkan terlebih dahulu."
        ]
      },
      {
        "number": 12,
        "title": "Proses Bayaran Balik",
        "blocks": [
          "Selepas permohonan bayaran balik diluluskan dan sebarang pengesahan atau pemulangan yang diperlukan selesai, ASTAMALL menyasarkan untuk memulakan proses bayaran balik dalam tempoh **7–14 hari bekerja**.",
          "Bayaran balik akan diproses melalui kaedah pembayaran asal jika boleh.",
          "Jika kaedah asal tidak dapat digunakan, kami akan menghubungi pelanggan untuk mengatur kaedah pembayaran alternatif yang sesuai.",
          "Masa yang diperlukan untuk wang dikreditkan bergantung pada pihak bank, gerbang pembayaran atau penyedia perkhidmatan pembayaran.",
          "Sekiranya bayaran balik diwajibkan oleh undang-undang, pelanggan tidak akan dipaksa menerima kredit kedai sebagai penggantinya.",
          "Bayaran balik caj penghantaran asal, jika berkenaan, akan ditentukan berdasarkan sebab pemulangan dan undang-undang yang terpakai."
        ]
      },
      {
        "number": 13,
        "title": "Pembatalan Pesanan",
        "blocks": [
          "Pelanggan yang ingin membatalkan atau mengubah pesanan hendaklah menghubungi **astamall92@gmail.com** secepat mungkin.",
          "Kami akan berusaha membantu permohonan sebelum pesanan dihantar.",
          "Selepas penghantaran dibuat, pembatalan mungkin tidak lagi dapat dilaksanakan dan syarat pemulangan serta bayaran balik yang berkenaan akan digunakan.",
          "Jika ASTAMALL membatalkan pesanan kerana masalah stok, pemenuhan pesanan atau sebab lain di pihak kami, penyelesaian yang sesuai termasuk bayaran balik akan ditawarkan apabila berkenaan."
        ]
      },
      {
        "number": 14,
        "title": "Bungkusan Hilang, Lewat atau Tidak Diterima",
        "blocks": [
          "Jika bungkusan tidak diterima dalam tempoh yang dijangka, atau status penjejakan menunjukkan penghantaran selesai sedangkan pelanggan belum menerimanya, sila hubungi kami.",
          "ASTAMALL akan menjalankan semakan bersama syarikat kurier atau penyedia perkhidmatan penghantaran.",
          "Jika bungkusan disahkan hilang atau tidak dihantar, kami akan menyediakan penyelesaian yang sewajarnya, termasuk penggantian atau bayaran balik bergantung pada keadaan dan undang-undang.",
          "Pelanggan tidak perlu menyelesaikan masalah dengan kurier secara bersendirian sebelum menghubungi ASTAMALL."
        ]
      },
      {
        "number": 15,
        "title": "Keselamatan Produk dan Reaksi Alergi",
        "blocks": [
          "Pelanggan digalakkan membaca senarai bahan, arahan penggunaan, amaran dan penerangan produk sebelum menggunakannya.",
          "Kepekaan kulit, alahan dan kesan penggunaan mungkin berbeza antara individu.",
          "Jika berlaku iritasi atau tindak balas yang tidak diingini, hentikan penggunaan serta-merta dan dapatkan nasihat perubatan apabila perlu.",
          "Sila hubungi kami jika terdapat kebimbangan bahawa sesuatu produk mungkin cacat, tercemar, tidak selamat atau mempunyai pelabelan yang salah.",
          "Reaksi individu tidak semestinya membuktikan kecacatan produk, namun aduan akan dinilai secara adil mengikut undang-undang keselamatan produk dan perlindungan pengguna."
        ]
      },
      {
        "number": 16,
        "title": "Set Promosi dan Hadiah Percuma",
        "blocks": [
          "Produk yang dibeli dalam bentuk set, pakej hadiah atau promosi adalah tertakluk kepada polisi ini.",
          "Jika hanya sebahagian daripada set layak dipulangkan, jumlah bayaran balik akan dikira secara adil berdasarkan harga sebenar yang dibayar, diskaun berkaitan dan hak pengguna.",
          "Sampel atau hadiah percuma biasanya tidak mempunyai nilai pembelian berasingan untuk bayaran balik.",
          "Perkara ini tidak menjejaskan hak yang mungkin timbul daripada kecacatan produk promosi atau pembelian asal."
        ]
      },
      {
        "number": 17,
        "title": "Hak Pengguna",
        "blocks": [
          "Tiada peruntukan dalam polisi ini yang bertujuan mengecualikan, mengehadkan atau mengubah mana-mana hak, jaminan atau remedi pengguna yang tidak boleh dikecualikan di bawah **Akta Perlindungan Pengguna 1999**, peraturan berkaitannya atau undang-undang Malaysia yang lain.",
          "Sekiranya terdapat percanggahan antara polisi ini dan kehendak mandatori undang-undang, undang-undang yang berkenaan akan diguna pakai."
        ]
      },
      {
        "number": 18,
        "title": "Perubahan Polisi",
        "blocks": [
          "ASTAMALL boleh mengemas kini polisi ini dari semasa ke semasa bagi mencerminkan perubahan operasi, penambahbaikan perkhidmatan atau keperluan undang-undang.",
          "Versi terkini akan diterbitkan di laman web kami bersama tarikh kuat kuasa yang dikemas kini.",
          "Perubahan polisi tidak akan menarik balik hak atau remedi pengguna yang telah wujud daripada transaksi terdahulu."
        ]
      },
      {
        "number": 19,
        "title": "Maklumat Perhubungan",
        "blocks": [
          "Untuk pertanyaan mengenai penghantaran, pembatalan pesanan, produk rosak, pemulangan atau bayaran balik, sila hubungi:",
          {
            "title": "ASTA MALL PLT",
            "facts": [
              [
                "No. Pendaftaran Perniagaan",
                "202604002255"
              ],
              [
                "Laman Web",
                "https://www.astamall.com.my"
              ],
              [
                "E-mel",
                "astamall92@gmail.com"
              ]
            ]
          },
          "Kami komited untuk mengendalikan pertanyaan dan aduan pelanggan secara adil, profesional dan secepat yang munasabah."
        ]
      }
    ],
  },
};

checkLegalDocument('Shipping, Returns & Refund Policy', shippingReturns, 19);
