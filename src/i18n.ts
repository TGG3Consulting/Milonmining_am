import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    hy: {
        translation: {
            brand: "Milon Mining - Կառուցապատող Ընկերություն",
            nav: {
                about: "Մեր մասին",
                townhouses: "Թաունհաուսներ",
                apartments: "Բնակարաններ",
                decisions: "Որոշումներ"
            },
            decisions: {
                title: "Որոշումներ",
                plaza: {
                    date: "27.02.2026",
                    text: "Հարգելի Միլոն Պլազաի բնակիչներ, տեղեկացնում ենք Ձեզ, որ Աբովյան քաղաքի Օգոստոսի 23 թիվ 5 հասցեում կառուցվող բազմաբնակարան շենքի շին թույլտվությունը երկարացվել է մինչև սույն թվականի ապրիլի 6-ը, կից ներկայացնում ենք Աբովյան համայնքի ղեկավարի որոշումը:",
                    fileName: "Շին թույլտվություն — Օգոստոսի 23, երկարաձգում (PDF)"
                }
            },
            lang: {
                hy: "Հայ",
                ru: "Рус"
            },
            filters: {
                title: "Ֆիլտր",
                search: "Որոնում...",
                price_from: "Գին՝ սկիզբ",
                price_to: "Գին՝ վերջ",
                bed: "սենյ.",
                status: "Կարգավիճակ",
                square_from: "Մակերես ≥",
                plot_from: "Հողատարածք ≥",
                terrace_from: "տերասսա ≥",
                sort: {
                    price_desc: "Գին՝ ց.→բ.",
                    price_asc: "Գին՝ բ.→ց.",
                    size_desc: "Մակերես՝ բ.→ց.",
                    size_asc: "Մակերես՝ ց.→բ."
                },
                reset: "Մաքրել"
            },
            list: {
                loading: "Բեռնում...",
                empty: "Չկան արդյունքներ",
                end: "Ավարտ"
            },
            discount: "Զեղչ",
            status: {
                active: "Առկա",
                reserved: "Պահված",
                sold: "Վաճառված"
            },
            units: {
                amd: "֏",
                plot: "սոտկա"
            },
            about: {
                title: "Մեր Մասին",
                body: "Շենքերի կառուցապատում և անշարժ գույքի վաճառք",
                contactsTitle: "Կոնտակտային տվյալներ",
                companyTitle: "Ընկերության մասին",
                companyText: "Միլոն Մայնինգ ընկերությունը ստեղծվել է 2001 թվականին, Բաբկեն Հովակիմյանի կողմից։ Հիմնական գործունեությունը եղել է շինանյութերի մանրածախ վաճառքը։ Հիմնադրի աշխատասիրությունն ու բանիմացությունը հանգեցրել են նրան, որ կազմակերպությունը սկսել է դինամիկ զարգանալ, իրականացրել ինչպես մանրածախ, այնպես էլ շինանյութերի մեծածախ վաճառք։ Կազմակերպությունն իր առջև դրած ցանկացած առաջադրանք կատարում է ժամանակին և որակով։",
                timelineTitle: "Ժամանակագիծ",
                address: "Կոտայքի մարզ, գ․ Առինջ Բ թաղամաս 1-ին փ․ 1/1"
            },
            company: {
                name: "ՄԻԼՈՆ ՄԱՅՆԻՆԳ ՍՊԸ",
                address: "Կոտայքի մարզ, գ․ Առինջ Բ թաղամաս 1-ին փ․ 1/1",
                materials: {
                    title: "Շինանյութերի վաճառք",
                    tagline: "Շինանյութի վաճառք անմիջապես ներմուծողից",
                    list: ["ԱՄՐԱՆ/ԱՄՐԱԼԱՐ ՄԵՏԱՂՆԵՐ", "ՓԱՅՏԱՆՅՈՒԹԵՐ ԵՎ ՏԱԽՏԱԿՆԵՐ", "ԱՆՎՃԱՐ ԽՈՐՀՐԴԱԿՑՈՒԹՅՈՒՆ"]
                },
                legalName: "ՄԻԼՈՆ ՄԱՅՆԻՆԳ ՍՊԸ",
                director: "Տնօրեն Բ․ Հովակիմյան",
                tinLabel: "ՀՎՀՀ",
                tin: "01540483",
                accountLabel: "Հ/Հ",
                account: "1570077489300100",
                bankName: "Ամերիաբանկ ՓԲԸ",
                email: "info@milonmining.am",
                phones: ["+374 60 770909", "+374 44 940909"],
                timeline: {
                    t2005: {
                        year: "2005",
                        title: "ԱՐՏԱԴՐՈՒԹՅՈՒՆ",
                        text: "Կազմակերպությունը 2005 թվականից սկսած զբաղվում է տարբեր տեսակի շինարարական ապրանքների արտադրությամբ։ Տարիների ընթացքում ձեռք է բերել բարի համբավ և վստահելի գործընկերոջ անուն։"
                    },
                    t2010: {
                        year: "2010",
                        title: "ՆԵՐՄՈՒԾՈՒՄ",
                        text: "2010թ-ից սկսեց զբաղվել նաև շինանյութերի ներմուծմամբ, հատկապես փայտանյութերի ներմուծման և վաճառքի ծավալներով իր ուրույն տեղը զբաղեցրեց Հայաստանի Հանրապետությունում։"
                    },
                    t2016: {
                        year: "2016–2020",
                        title: "ԲԵՌՆԱՓՈԽԱԴՐՈՒՄ",
                        text: "2016-2020 թվականներին զբաղվել է միջազգային բեռնափոխադրումներով։"
                    },
                    t2021: {
                        year: "2021",
                        title: "ԿԱՌՈՒՑԱՊԱՏՈՒՄ",
                        text: "Հիմնադրի կողմից առաջ քաշվեց կառուցապատմամբ զբաղվելու առաջադրանքը և այն երկար սպասել չտվեց։ Ի շնորհիվ կազմակերպության բանիմաց և նպատակասլաց թիմի, 2021թ-ին մեկնարկ տրվեց մեծ նախագծի՝ ք. Աբովյան, Օգոստոսի 23 փողոց, թիվ 5 հասցեում ՄԻԼՈՆ ՊԼԱԶԱ բազմաբնակարան համալիրի կառուցման։ Նախագծված շենքը անկրկնելի է իր ճարտարապետական ոճով և որակով։"
                    },
                    t2022: {
                        year: "2022",
                        title: "ՆԱԽԱԳԾՈՒՄ",
                        text: "2022թ-ին մեկնարկվեց ևս մեկ ավելի մեծ նախագիծ՝ Աբովյան համայնք Առինջ բնակավայրի Բ. թաղամաս 1 փողոց 7 հասցեում Միլոն Հիլս թաղամաս, որն իր մեջ ներառում է բազմաֆունկցիոնալ բնակելի համալիր, ժամանցի վայրեր, ընդարձակ այգի և առանձին թաունհաուսներ։"
                    },
                    t2023: {
                        year: "2023",
                        title: "ՆԱԽԱԳԾՈՒՄ",
                        text: "2023թ.-ին մեկնարկվեց ևս մեկ ավելի մեծ բիզնես դասի նախագիծ՝ ՄԻԼՈՆ ԹԱՈՒԵՐ համալիրը, որը գտնվում է ք. Աբովյանի ամենականաչապատ գոտում, Բարեկամության հրապարակ 5/1 հասցեում։ Այս բազմաֆունկցիոնալ համալիրը ներառում է առևտրի, ժամանցի և զարգացման կենտրոններ։ Այն առանձնանում է իր ժամանակակից ճարտարապետական լուծումներով՝ գրեթե բոլոր պատուհանները վիտրաժային են, ինչը շենքին հաղորդում է բացառիկ տեսք և ապահովում է առավելագույն բնական լուսավորություն։"
                    }
                }
            },
            home: {
                title: "Գլխավոր",
                desc: "Շինարարական ընկերության պաշտոնական կայք",
                chooseProject: "Ընտրել նախագիծ",
                viewPhotos: "Դիտել լուսանկարները",
                gallery: "Սլայդշոու",
                book: "Ամրագրել",
                units: "Բնակարաններ",
                area: "Քմ․ միջակայք",
                sqm: "քմ․",
                parking: "Ավտոկայանատեղի",
                welcomeTitle: "Բարի գալուստ",
                welcomeText: "Ընտրեք նախագիծը, նշեք մակերեսն ու սենյակների թիվը և ամրագրեք հիմա՝ կամ կապ հաստատեք մեզ հետ։"
            },
            projects: [
                {
                    id: "milon-tower",
                    name: "ՄԻԼՈՆ ԹԱՈՒԵՐ ՀԱՄԱԼԻՐ",
                    address: "Կոտայքի մարզ, ք․ Աբովյան, Բարեկամության հրապարակ, 5/1",
                    start: "2024-11-13",
                    end: "2027-10-04",
                    units: 461,
                    areaMin: 35.1,
                    areaMax: 240.3,
                    parking: 234,
                    coords: {
                        lat: 40.27146521335858,
                        lng: 44.61866758168769
                    },
                    images: ["/src/assets/images/tower-gallery-5.jpg", "/src/assets/images/tower-gallery-1.jpg", "/src/assets/images/tower-gallery-2.jpg", "/src/assets/images/tower-gallery-3.jpg", "/src/assets/images/tower-gallery-4.jpg", "/src/assets/images/tower-gallery-6.jpg", "/src/assets/images/tower-gallery-7.jpg", "/src/assets/images/tower-gallery-8.jpg", "/src/assets/images/tower-gallery-9.jpg", "/src/assets/images/tower-gallery-10.jpg"]
                },
                {
                    id: "milon-hills",
                    name: "ՄԻԼՈՆ ՀԻԼԼՍ ԹԱՂԱՄԱՍ",
                    address: "Կոտայքի մարզ, գ․ Առինջ Բ թաղամաս, 1-ին փ., թիվ 7",
                    start: "2023-09-19",
                    end: "2026-09-08",
                    units: 211,
                    areaMin: 47,
                    areaMax: 165,
                    parking: 155,
                    coords: {
                        lat: 40.281379,
                        lng: 44.62814
                    },
                    images: ["/src/assets/images/hillz-gallery-2.jpg", "/src/assets/images/hillz-gallery-1.jpg", "/src/assets/images/hillz-gallery-3.jpg", "/src/assets/images/hillz-gallery-4.jpg", "/src/assets/images/hillz-gallery-5.jpg", "/src/assets/images/hillz-gallery-6.jpg", "/src/assets/images/hillz-gallery-7.jpg", "/src/assets/images/hillz-gallery-8.jpg", "/src/assets/images/hillz-gallery-9.jpg", "/src/assets/images/hillz-gallery-10.jpg", "/src/assets/images/hillz-gallery-11.jpg", "/src/assets/images/hillz-gallery-12.jpg", "/src/assets/images/hillz-gallery-13.jpg", "/src/assets/images/hillz-gallery-17.jpg"]
                },
                {
                    id: "milon-plaza",
                    name: "ՄԻԼՈՆ ՊԼԱԶԱ ՀԱՄԱԼԻՐ",
                    address: "Կոտայքի մարզ, ք. Աբովյան, Օգոստոսի 23 փ., թիվ 5",
                    start: "2022-09-06",
                    end: "2025-12-30",
                    units: 168,
                    areaMin: 50.5,
                    areaMax: 324,
                    parking: 52,
                    coords: {
                        lat: 40.281379,
                        lng: 44.62814
                    },
                    images: ["/src/assets/images/plaza-gallery-2.jpg", "/src/assets/images/plaza-gallery-1.jpg", "/src/assets/images/plaza-gallery-3.jpg", "/src/assets/images/plaza-gallery-4.jpg", "/src/assets/images/plaza-gallery-5.jpg", "/src/assets/images/plaza-gallery-6.jpg", "/src/assets/images/plaza-gallery-7.jpg", "/src/assets/images/plaza-gallery-8.jpg", "/src/assets/images/plaza-gallery-9.jpg"]
                }
            ],
            features: {
                security: {
                    title: "ԱՊԱՀՈՎՈՒԹՅՈՒՆ",
                    desc: "Ամուր շինություն, ցանկապատ տարածք, անվտանգության կետ, անհատական այգի"
                },
                prices: {
                    title: "ՑԱԾՐ ԳՆԵՐ",
                    desc: "Ընդարձակ բնակարաններ և տներ մատչելի գներով, գործում է եկամտահարկի վերադարձի օրենքը"
                },
                modern: {
                    title: "ԺԱՄԱՆԱԿԱԿԻՑ ԼՈՒԾՈՒՄՆԵՐ",
                    desc: "Նոր տեխնոլոգիաների ներդրում և բարձրորակ նյութերի օգտագործում"
                }
            },
            footer: {
                infoTitle: "ՏՎՅԱԼՆԵՐ",
                contactsTitle: "ԿՈՆՏԱԿՏՆԵՐ",
                rights: "Բոլոր իրավունքները պաշտպանված են"
            },
            social: {
                instagram: "https://www.instagram.com/milon.mining?igsh=MTdjYWY5ZzJydWU1Mw==",
                facebook: "https://www.facebook.com/share/1EiZBDh6iC/?mibextid=wwXIfr"
            },
            common: {
                close: "Փակել",
                loading: "Բեռնվում է…",
                cancel: "Չեղարկել",
                sqm: "քմ",
                viewMore: "Տեսնել ավելին"
            },
            booking: {
                close: "Փակել",
                tabs: {
                    layout: "Մակետ",
                    filter: "Ֆիլտրել"
                },
                layout: {
                    placeholder: "Մակետի բաժինը շուտով կավելացնենք"
                },
                rooms: {
                    title: "Սենյակների ընտրություն",
                    n: "{{count}} սենյակ"
                },
                field: {
                    floor: "Հարկ",
                    area: "Քմ․",
                    price: "Գին"
                },
                price: {
                    soon: "Շուտով"
                },
                unit: {
                    locked: "Բլոկավորված",
                    available: "Առկա"
                },
                actions: {
                    reserve: "Ուղարկել ամրագրման հայտ",
                    sent: "Հայտը ուղարկվեց (Demo)"
                },
                layoutPlaceholder: "Մակետի բաժինը շուտով կավելացնենք",
                filters: {
                    available: {
                        title: "Առկա / Պահված + Վաճառված",
                        on: "Առկա",
                        off: "Պահված + Վաճառված"
                    },
                    rooms: "{{count}} սենյակ",
                    duplex: {
                        any: "Բոլորը",
                        yes: "Դուպլեքս",
                        no: "Սովորական"
                    },
                    squareGte: "Քմ ≥",
                    allFloors: "Բոլոր հարկերը",
                    floor: "{{n}} հարկ",
                    reset: "Մաքրել"
                },
                card: {
                    floor: "Հարկ",
                    area: "Քմ․",
                    sqm: "քմ",
                    price: "Գին",
                    soon: "Շուտով"
                },
                status: {
                    active: "Առկա",
                    reserved: "Պահված",
                    sold: "Վաճառված"
                },
                viewPosition: {
                    btn: "Տեսնել դիրքը",
                    soon: "Շուտով հասանելի կլինի"
                },
                reserve: "Ամրագրել",
                already_reserve: "Ամրագրել եք",
                preview: "Նախադիտել",
                reserveSent: "Հայտը ուղարկվեց {{name}} ({{phone}})",
                callback: "Պատվիրել հետ զանգ"
            },
            reserve: {
                title: "Ամրագրում",
                subtitle: "Բնակարան №{{id}}, {{sqm}} քմ, {{floor}} հարկ",
                fields: {
                    name: "Անուն, ազգանուն",
                    phone: "Հեռախոսահամար"
                },
                placeholders: {
                    name: "Օր.՝ Անահիտ Պետրոսյան"
                },
                hint: "Մուտքագրեք համարն այս ձևով՝ +374XXXXXXXX",
                submit: "Ուղարկել",
                errors: {
                    phone: "Խնդրում ենք մուտքագրել ճիշտ հայաստանյան համար՝ +374XXXXXXXX",
                    name: "Խնդրում ենք մուտքագրել անունը"
                },
                kinds: {
                    apartment: "Բնակարան",
                    townhouse: "Թաունհաուս"
                },
                floorN: "{{n}} հարկ"
            },
            townhouse: {
                viewModels: "Տեսնել մակետները",
                card: {
                    sqm: "Ընդհանուր մակերես",
                    terrace: "տերասսա",
                    address: "Հասցե"
                }
            },
            comingSoon: {
                title: "Շուտով հասանելի",
                subtitle: "Բնակարաններն ու տները ներկայումս թարմացվում են։ Խնդրում ենք վերադառնալ մոտակա 24 ժամում։",
                hours: "ժամ",
                minutes: "րոպե",
                seconds: "վայրկյան",
                note: "Տվյալները բեռնվելուց հետո բաժինը կբացվի ավտոմատ։"
            },
            seeDetails: "Տեսնել բնակարանները",
            suggests: "Առաջարկներ"
        }
    },
    ru: {
        translation: {
            brand: "Milon Mining - Строительная компания",
            nav: {
                about: "О нас",
                townhouses: "Таунхаусы",
                apartments: "Квартиры",
                decisions: "Решения"
            },
            decisions: {
                title: "Решения",
                plaza: {
                    date: "27.02.2026",
                    text: "Уважаемые жители «Милон Плаза», сообщаем Вам, что разрешение на строительство многоквартирного дома, возводимого по адресу: г. Абовян, ул. 23 Августа, д. 5, продлено до 6 апреля текущего года. Прилагаем решение главы общины Абовян.",
                    fileName: "Разрешение на строительство — ул. 23 Августа, продление (PDF)"
                }
            },
            lang: {
                hy: "Арм",
                ru: "Рус"
            },
            filters: {
                title: "Фильтр",
                search: "Поиск...",
                price_from: "Цена от",
                price_to: "Цена до",
                bed: "комн.",
                status: "Статус",
                square_from: "Площадь ≥",
                plot_from: "Участок ≥",
                terrace_from: "Терраса ≥",
                sort: {
                    price_desc: "Цена: по убыв.",
                    price_asc: "Цена: по возвр.",
                    size_desc: "Площадь: по убыв.",
                    size_asc: "Площадь: по возвр."
                },
                reset: "Сбросить"
            },
            list: {
                loading: "Загрузка...",
                empty: "Нет результатов",
                end: "Конец"
            },
            discount: "Скидка",
            status: {
                active: "Доступно",
                reserved: "Зарезервировано",
                sold: "Продано"
            },
            units: {
                amd: "֏",
                plot: "сотка"
            },
            about: {
                title: "О нас",
                body: "Строительство зданий и продажа недвижимости",
                contactsTitle: "Контакты",
                companyTitle: "О компании",
                companyText: "Компания Milon Mining основана в 2001 году Бабкеном Овакимяном. Первоначально основной деятельностью была розничная продажа стройматериалов. Трудолюбие и профессионализм основателя позволили компании динамично развиваться, выйти на оптовые поставки и укрепить репутацию надежного партнера. Мы выполняем любые задачи вовремя и качественно.",
                timelineTitle: "Вехи",
                address: "Котайкская область, с. Арандж, квартал Б, ул. 1, дом 1/1"
            },
            company: {
                name: "МИЛОН МАЙНИНГ ООО",
                address: "Марз Котайк, г. Араиндж, м-н Б, 1-я ул., 1/1",
                materials: {
                    title: "Продажа стройматериалов",
                    tagline: "Поставки напрямую от импортёра",
                    list: ["АРМАТУРА / МЕТАЛЛОПРОКАТ", "ДРЕВЕСИНА И ПЛИТЫ", "БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ"]
                },
                legalName: "ООО «Милон Майнинг»",
                director: "Директор Б. Овакимян",
                tinLabel: "ИНН",
                tin: "01540483",
                accountLabel: "Р/с",
                account: "1570077489300100",
                bankName: "Америабанк ЗАО",
                email: "info@milonmining.am",
                phones: ["+374 60 770909", "+374 44 940909"],
                timeline: {
                    t2005: {
                        title: "2005 · ПРОИЗВОДСТВО",
                        text: "С 2005 года компания занимается производством различных строительных материалов, завоевав репутацию надежного партнера."
                    },
                    t2010: {
                        title: "2010 · ИМПОРТ",
                        text: "С 2010 года осуществляет импорт стройматериалов, заняв заметное место на рынке Республики Армения, особенно по древесине."
                    },
                    t2016: {
                        title: "2016–2020 · ГРУЗОПЕРЕВОЗКИ",
                        text: "В 2016–2020 годах занималась международными грузоперевозками."
                    },
                    t2021: {
                        title: "2021 · ДЕВЕЛОПМЕНТ",
                        text: "Запущен проект многоэтажного комплекса «Milon Plaza» по адресу г. Абовян, ул. 23 Августа, д. 5. Проект выделяется архитектурным стилем и качеством."
                    },
                    t2022: {
                        title: "2022 · ПРОЕКТИРОВАНИЕ",
                        text: "Стартовал проект «Milon Hills» (г. Абовян, пос. Араиндж, кв. Б, ул. 1, дом 7): жилой комплекс с зонами отдыха, парком и таунхаусами."
                    },
                    t2023: {
                        title: "2023 · ПРОЕКТИРОВАНИЕ",
                        text: "Стартовал проект бизнес-класса «Milon Tower» (г. Абовян, пл. Дружбы 5/1): многофункциональный комплекс с торговыми, досуговыми и образовательными центрами, современная архитектура с витражным остеклением."
                    }
                }
            },
            home: {
                title: "Главная",
                desc: "Официальный сайт строительной компании",
                chooseProject: "Выбрать проект",
                viewPhotos: "Смотреть фото",
                gallery: "Слайд-шоу",
                book: "Забронировать",
                units: "Квартиры",
                area: "Диапазон м²",
                sqm: "м²",
                parking: "Паркинг",
                welcomeTitle: "Добро пожаловать",
                welcomeText: "Выберите проект, укажите площадь и количество комнат и забронируйте сейчас — или свяжитесь с нами.",
                tabs: {
                    apartments: "Квартиры",
                    townhouses: "Таунхаусы"
                }
            },
            projects: [
                {
                    id: "milon-tower",
                    name: "ЖК «Милон Тауэр»",
                    address: "Котайкский марз, г. Абовян, площадь Дружбы, д. 5/1",
                    start: "2024-11-13",
                    end: "2027-10-04",
                    units: 461,
                    areaMin: 35.1,
                    areaMax: 240.3,
                    parking: 234,
                    coords: {
                        lat: 40.27146521335858,
                        lng: 44.61866758168769
                    },
                    images: ["https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1491884662610-dfcd28f30cf5?q=80&w=1600&auto=format&fit=crop"]
                },
                {
                    id: "milon-hills",
                    name: "Микрорайон «Milon Hills»",
                    address: "Котайкский марз, с. Ариндж, квартал Б, ул. 1, д. 7",
                    start: "2023-09-19",
                    end: "2026-09-08",
                    units: 211,
                    areaMin: 47,
                    areaMax: 165,
                    parking: 155,
                    coords: {
                        lat: 40.281379,
                        lng: 44.62814
                    },
                    images: ["https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1600&auto=format&fit=crop"]
                },
                {
                    id: "milon-plaza",
                    name: "ЖК «Milon Plaza»",
                    address: "Котайкский марз, г. Абовян, ул. 23 Августа, д. 5",
                    start: "2022-09-06",
                    end: "2025-12-30",
                    units: 168,
                    areaMin: 50.5,
                    areaMax: 324,
                    parking: 52,
                    coords: {
                        lat: 40.27146521335858,
                        lng: 44.62814
                    },
                    images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?q=80&w=1600&auto=format&fit=crop"]
                }
            ],
            features: {
                security: {
                    title: "БЕЗОПАСНОСТЬ",
                    desc: "Прочное здание, огороженная территория, пост охраны, индивидуальный сад"
                },
                prices: {
                    title: "НИЗКИЕ ЦЕНЫ",
                    desc: "Просторные квартиры и дома по доступным ценам, действует закон о возврате подоходного налога"
                },
                modern: {
                    title: "СОВРЕМЕННЫЕ РЕШЕНИЯ",
                    desc: "Внедрение новых технологий и использование высококачественных материалов"
                }
            },
            footer: {
                infoTitle: "ДАННЫЕ",
                contactsTitle: "КОНТАКТЫ",
                rights: "Все права защищены"
            },
            social: {
                instagram: "https://www.instagram.com/milon.mining?igsh=MTdjYWY5ZzJydWU1Mw==",
                facebook: "https://www.facebook.com/share/1EiZBDh6iC/?mibextid=wwXIfr"
            },
            common: {
                close: "Закрыть",
                loading: "Загрузка…",
                cancel: "Отменить",
                sqm: "м²",
                viewMore: "Смотреть все"
            },
            booking: {
                close: "Закрыть",
                tabs: {
                    layout: "Макет",
                    filter: "Фильтр"
                },
                layout: {
                    placeholder: "Раздел макета будет добавлен позже"
                },
                layoutPlaceholder: "Раздел макета будет добавлен позже",
                rooms: {
                    title: "Выбор комнат",
                    n: "{{count}} комн."
                },
                field: {
                    floor: "Этаж",
                    area: "Площадь",
                    price: "Цена"
                },
                price: {
                    soon: "Скоро"
                },
                unit: {
                    locked: "Заблокировано",
                    available: "Доступно"
                },
                actions: {
                    reserve: "Отправить заявку на бронирование",
                    sent: "Заявка отправлена (демо)"
                },
                filters: {
                    available: {
                        title: "Доступно / Зарезервировано + Продано",
                        on: "Доступно",
                        off: "Зарезервировано + Продано"
                    },
                    rooms: "{{count}} комн.",
                    duplex: {
                        any: "Все",
                        yes: "Дуплекс",
                        no: "Обычная"
                    },
                    squareGte: "м² ≥",
                    allFloors: "Все этажи",
                    floor: "{{n}} этаж",
                    reset: "Сбросить"
                },
                card: {
                    floor: "Этаж",
                    area: "Площадь",
                    sqm: "м²",
                    price: "Цена",
                    soon: "Скоро"
                },
                status: {
                    active: "Доступно",
                    reserved: "Зарезервировано",
                    sold: "Продано"
                },
                viewPosition: {
                    btn: "Посмотреть расположение",
                    soon: "Скоро будет доступно"
                },
                reserve: "Забронировать",
                already_reserve: "Забронировали",
                preview: "Предпросмотр",
                reserveSent: "Заявка отправлена {{name}} ({{phone}})",
                callback: "Заказать обратный звонок"
            },
            reserve: {
                title: "Бронирование",
                subtitle: "Квартира №{{id}}, {{sqm}} м², {{floor}} этаж",
                fields: {
                    name: "Имя, фамилия",
                    phone: "Номер телефона"
                },
                placeholders: {
                    name: "Напр.: Анаит Петросян"
                },
                hint: "Введите номер в формате: +374XXXXXXXX",
                submit: "Отправить",
                errors: {
                    phone: "Пожалуйста, введите корректный армянский номер: +374XXXXXXXX",
                    name: "Пожалуйста, введите имя"
                },
                kinds: {
                    apartment: "Квартира",
                    townhouse: "Таунхаус"
                },
                floorN: "{{n}} этаж"
            },
            townhouse: {
                viewModels: "Смотреть макеты",
                card: {
                    sqm: "Общая площадь",
                    terrace: "Терраса",
                    address: "Адрес"
                }
            },
            comingSoon: {
                title: "Скоро будет доступно",
                subtitle: "Квартиры и дома обновляются. Пожалуйста, загляните в течение ближайших 24 часов.",
                hours: "часы",
                minutes: "минуты",
                seconds: "секунды",
                note: "Раздел откроется автоматически, как только данные появятся."
            },
            seeDetails: "Посмотреть квартиры",
            suggests: "Предложения"
        }
    }
};

export function setupI18n() {
    if (!i18next.isInitialized) {
        i18next.use(initReactI18next).init({
            resources,
            lng: localStorage.getItem("lang") || "hy",
            fallbackLng: "hy",
            interpolation: { escapeValue: false }
        });
    }
    return i18next;
}
