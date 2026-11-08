(() => {
  "use strict";

  const D = window.MILON_DATA;
  if (!D) throw new Error("MILON_DATA is required");
  const ROOT = new URL(".", document.currentScript?.src || document.baseURI || location.href).href;
  const app = document.querySelector("#app");
  const page = document.body.dataset.page || "home";
  const projectKey = document.body.dataset.project || "";
  const query = new URLSearchParams(location.search);
  const forcedLang = document.body.dataset.lang;
  let lang = ["hy", "ru"].includes(forcedLang) ? forcedLang : (["hy", "ru"].includes(query.get("lang")) ? query.get("lang") : localStorage.getItem("milon-language") || "hy");
  const CATALOG_PAGE_SIZE = 12;
  let catalogPageNumber = Math.max(1, Number.parseInt(query.get("page") || "1", 10) || 1);

  const C = {
    hy: {
      projects: "Նախագծեր", apartments: "Բնակարաններ", offers: "Առաջարկներ", about: "Մեր մասին", parking: "Կայանատեղի", contacts: "Կապ",
      choose: "Ընտրել բնակարան", heroK: "Բնակարաններ Աբովյանում և Առինջում", heroT: "Տարածք, որտեղ կյանքը բացվում է",
      heroP: "Milon Mining-ը ստեղծում է բնակելի միջավայրեր, որտեղ ժամանակակից ճարտարապետությունը, հարմարավետությունն ու երկարաժամկետ արժեքը միավորվում են մեկ ամբողջության մեջ։",
      seeProjects: "Դիտել նախագծերը", discover: "Բացահայտել", finderK: "Բնակարանի ընտրություն", finderT: "Ընտրեք լավագույն տարբերակը ձեզ համար",
      finderP: "", project: "Նախագիծ", allProjects: "Բոլոր նախագծերը",
      rooms: "Սենյակներ", any: "Բոլորը", areaFrom: "Մակերես՝ սկսած", areaTo: "Մակերես՝ մինչև", priceFrom: "Արժեք՝ սկսած",
      priceTo: "Արժեք՝ մինչև", floors: "Հարկեր", allFloors: "Բոլոր հարկերը", reset: "Մաքրել", show: "Ցույց տալ", apt: "բնակարան",
      projectK: "Մեր նախագծերը", projectT: "Չորս հասցե, մեկ մոտեցում", projectP: "Milon-ի չորս նախագծերը տարբերվում են ձևաչափով, տեղադրությամբ և շրջակայքով՝ առաջարկելով բնակության տարբեր միջավայրեր։",
      projectMore: "Նախագծի մասին", companyK: "Milon Mining", companyT: "Մենք պարզապես շենքեր չենք կառուցում․ մենք ստեղծում ենք առօրյա կյանքի հիմքը",
      companyP: "2001 թվականից ընկերությունը զարգացել է՝ շինանյութի ոլորտում կուտակելով տարիների փորձ և մասնագիտական գիտելիք։ Այսօր մենք ստեղծում ենք բնակելի միջավայրեր՝ խորապես հասկանալով նյութը, յուրաքանչյուր գործընթացի կարևորությունն ու այն պատասխանատվությունը մեր բնակիչների առաջ:",
      aboutCompany: "Ընկերության մասին", mapK: "Տեղադրություն", mapT: "Իրական հասցեներ՝ իրական քարտեզի վրա",
      mapP: "Համեմատեք նախագծերի տեղադրությունը, Երևանի կենտրոնից հեռավորությունն ու ճանապարհի մոտավոր տևողությունը։", mapOpen: "Բացել Google Maps-ում",
      mapDistance: "Հեռավորությունը Երևանի կենտրոնից", mapTime: "Ճանապարհը մեքենայով", mapTimeNote: "Մոտավոր՝ առանց խցանումների հաշվառման", projectOpen: "Բացել նախագիծը",
      comfortK: "Ամենօրյա հարմարավետություն", comfortT: "Մտածված մինչև սովորական պահերը",
      comfort: [["Անվտանգ բակ", "Հետիոտնային, լուսավորված և վերահսկվող ընդհանուր տարածքներ։"], ["Հուսալի համակարգեր", "Ինժեներական լուծումներ՝ երկարաժամկետ շահագործման համար։"], ["Կայանատեղի", "Մեքենայի հարմար մուտք և նախագծին համապատասխան կայանման սցենարներ։"], ["Մոտ ենթակառուցվածք", "Կրթություն, առևտուր, սպորտ և ծառայություններ՝ տրամաբանական հեռավորության վրա։"]],
      contactK: "Կապ", contactT: "Ընտրել բնակարան", contactP: "Թողեք համարը և նշեք, թե ինչպես է ձեզ հարմար կապվել։ Մասնագետը կպատասխանի ձեր հարցերին։",
      name: "Անուն", phone: "Հեռախոս", method: "Նախընտրելի կապ", call: "Զանգ", whatsapp: "WhatsApp", viber: "Viber", telegram: "Telegram",
      consent: "Համաձայն եմ", privacyPolicy: "գաղտնիության քաղաքականությանը", and: "և", personal: "անձնական տվյալների մշակմանը", send: "Ուղարկել հարցում",
      pendingBackend: "Առցանց ուղարկումը կաշխատի Bitrix24-ի միացումից հետո։ Այժմ կարող եք զանգահարել մեզ՝", sending: "Ուղարկվում է…", sent: "Շնորհակալություն։ Հարցումն ուղարկվել է։", sendError: "Չհաջողվեց ուղարկել։ Խնդրում ենք զանգահարել կամ կրկին փորձել։",
      catalogK: "Բնակարանների կատալոգ", catalogT: "Ընտրեք տվյալներով, ոչ թե ենթադրությամբ", catalogP: "Համեմատեք բնակարանները ըստ հարկի, մակերեսի և արժեքի։ Արդիական հասանելիությունը պետք է համաժամացվի վաճառքի համակարգի հետ։",
      found: "Գտնվել է", sort: "Դասավորել", sortFloor: "Հարկ՝ բարձրից ցածր", sortPrice: "Գին՝ ցածրից բարձր", sortArea: "Մակերես՝ փոքրից մեծ",
      status: "Կարգավիճակ", no: "Բնակարան №", area: "Մակերես", floor: "Հարկ", price: "Արժեք", available: "Հասանելի է", sold: "Վաճառված է", reserved: "Ամրագրված է", book: "Ամրագրել",
      unitPlan: "Բնակարանի հատակագիծ", floorPlan: "Հարկի հատակագիծ", projectRender: "Նախագծի տեսքը", unitDetails: "Մանրամասն", openUnit: "Բացել բնակարանի քարտը", galleryPosition: "Պատկեր", pageLabel: "Էջ", previousPage: "Նախորդ էջ", nextPage: "Հաջորդ էջ",
      empty: "Այս չափանիշներով հրապարակված բնակարաններ չկան։ Փոխեք զտիչները կամ կապվեք մեզ հետ։", bookingT: "Ամրագրման հարցում", selected: "Ընտրված բնակարան", close: "Փակել",
      completion: "Հանձնման ժամկետ", galleryK: "Պատկերասրահ", galleryT: "Ճարտարապետություն և միջավայր", benefitK: "Առավելություններ", benefitT: "Միջավայր, որը աշխատում է ամեն օր",
      projectApts: "Բնակարաններ նախագծում", towerApts: "Ընտրեք բնակարան Milon Tower-ում", projectAptsP: "Բնակարանների ամբողջական ցանկը բացվում է առանձին կատալոգում՝ առանց նախագծի պատմությունը ծանրաբեռնելու։", catalogOpen: "Բացել կատալոգը",
      soldOut: "Այս նախագծի բնակարանները վաճառված են։ Կարող ենք առաջարկել այլ Milon նախագիծ։", unpublished: "Այս նախագծի բնակարանների արդիական ցանկը դեռ հրապարակված չէ։ Թողեք հարցում՝ անհատական առաջարկ ստանալու համար։",
      floorK: "Ինտերակտիվ ընտրություն", floorT: "Ընտրեք հարկը անմիջապես ճակատից", floorP: "Սեղմեք հարկին՝ նույն էկրանին բնակարանների ընտրությունը տեսնելու համար։", chooseFloor: "Ընտրել հարկը", back: "Հետ",
      plan: "հարկի նավիգացիոն սխեմա", planNote: "Ընտրված հարկի բնակարանները ցուցադրված են սխեմայի տակ։ Բացեք բնակարանի քարտը՝ հատակագիծն ու մանրամասները տեսնելու համար։", floorNoUnits: "Այս հարկի բնակարանների արդիական տվյալները դեռ հրապարակված չեն։ Դիտեք ամբողջ կատալոգը կամ կապվեք մեզ հետ։",
      towerChooseT: "Ընտրել բնակարան", towerChooseP: "Բնակարանը գտեք շենքի ինտերակտիվ սխեմայով կամ համեմատեք բոլոր տարբերակները կատալոգում։", towerCatalogButton: "Դիտել բնակարանները կատալոգում", openCatalog: "Բացել բնակարանների կատալոգը", catalogMode: "Կատալոգ", catalogMapMode: "Ինտերակտիվ քարտեզ", catalogSchemeIntro: "Milon Tower-ի բնակարանը կարող եք ընտրել նաև շենքի, հարկի և հատակագծի սխեմայով՝ առանց կատալոգից դուրս գալու։", catalogSchemeButton: "Ընտրել շենքի սխեմայով", catalogFilters: "Զտիչներ", catalogBack: "Վերադառնալ կատալոգ",
      finishK: "Հարդարում", finishT: "Հիմք՝ ձեր ինտերիերի համար", towerFinishT: "Հարդարում", finishP: "Բնակարանները փոխանցվում են նախնական հարդարմամբ՝ հարթեցված մակերեսներով և հիմնական ինժեներական մուտքերով։ Վերջնական կոմպլեկտացիան հաստատվում է ընտրված բնակարանի պայմանագրում։",
      technical: "Օդափոխության, պատուհանների և ինժեներական հանգույցների իրական լուսանկարները սպասվում են կառուցապատողից։",
      parkingK: "Կայանատեղի", parkingT: "Հարմարավետ բնակելի միջավայր", towerParkingT: "Կայանատեղի՝ տան կողքին", parkingP: "Հարմարավետ բնակելի միջավայրը ներառում է նաև մտածված մուտքեր, ազատ տեղաշարժ և կայանման հնարավորություններ։ Կայանատեղիների քանակի և պայմանների մասին մանրամասները տրամադրում է վաճառքի բաժինը։", parkingPage: "Կայանատեղիի էջ", illustration: "Պատկերազարդում",
      progressK: "Նախագծի թարմացումներ", progressT: "Շինարարության ընթացքը", progressP: "Շինհրապարակի արդիական լուսանկարները այստեղ կհրապարակվեն կառուցապատողի կողմից աշխատանքների փուլերի հաստատումից հետո։", monthPending: "Թարմացումը սպասվում է", photoPending: "Լուսանկարը սպասվում է", statusPending: "Արդիական լուսանկարն ու հաստատված կարգավիճակը սպասվում են կառուցապատողից", temporaryVisual: "Նախագծի ժամանակավոր պատկեր",
      purchaseK: "Գնման տարբերակներ", taxRefund: "Եկամտային հարկի վերադարձ", taxRefundP: "Աբովյանում կարող է գործել վերադարձի ծրագիրը․ կիրառելիությունը կախված է գնորդից և բնակարանից։", installment: "Տարաժամկետ վճարում", installmentP: "Հնարավոր պայմաններն ու ժամկետները ճշտեք վաճառքի բաժնում։", mortgageCalc: "Հիփոթեքի հաշվարկ", mortgageCalcP: "Կայքում հաշվարկեք մոտավոր ամսական վճարը։", mortgageHelp: "Մասնագետի աջակցություն", mortgageHelpP: "Մասնագետը կօգնի համեմատել տարբերակներն ու պատրաստել փաստաթղթերը։", calculate: "Հաշվել", calculateMortgage: "Հաշվել հիփոթեքը",
      mortgageT: "Հիփոթեքի նախնական հաշվարկ", mortgageIntro: "Հաշվարկը նախնական է և չի հանդիսանում բանկի առաջարկ։", propertyPrice: "Բնակարանի արժեք, ֏", downPayment: "Կանխավճար", downAmount: "Գումար", downPercent: "Տոկոս", termYears: "Ժամկետ, տարի", rate: "Տարեկան տոկոսադրույք, %", loanAmount: "Վարկի գումար", monthlyPayment: "Մոտավոր ամսական վճար", perMonth: "ամսական", selectedApartment: "Ընտրված բնակարան", mortgageInvalid: "Ստուգեք արժեքները․ կանխավճարը պետք է փոքր լինի բնակարանի արժեքից, ժամկետը՝ 1–50 տարի, իսկ տոկոսադրույքը՝ 0–100%։", mortgageNoPrice: "Այս բնակարանի արժեքը հրապարակված չէ։ Հաշվարկի համար դիմեք վաճառքի բաժին։",
      officeK: "Վաճառքի գրասենյակ", officeT: "Վաճառքի գրասենյակը՝ Երևանից ընդամենը մի քանի րոպե հեռավորության վրա", officeP: "Եկեք քննարկելու ձեր ապագա բնակարանը ձեզ հարմար ժամանակ։ Գրասենյակը գտնվում է Առինջում՝ Երևանի կենտրոնից մոտ 11–15 րոպե հեռավորության վրա՝ առանց խցանումների։", officeRoute: "Կառուցել երթուղի", officeRouteNote: "Երևանից՝ Սևանի մայրուղու ուղղությամբ",
      towerLocationP: "Milon Tower-ը գտնվում է այգիների, Սուրբ Հովհաննես Մկրտիչ եկեղեցու, մարզադպրոցի, ֆիթնես կենտրոնի, կարուսելների, թենիսի կորտի և քաղաքապետարանի հարևանությամբ։ Երևանի կողմից ուղիղ մուտքը թույլ է տալիս տուն հասնել՝ առանց ամբողջ քաղաքը հատելու, իսկ շրջակա միջավայրն ու առօրյա երթուղիները նպաստում են հանգիստ և անվտանգ կյանքի զգացողությանը։", neighborhoodT: "Ձեր ապագա թաղամասը քարտեզի վրա",
      offersK: "Հատուկ պայմաններ", offersT: "Հատուկ առաջարկներ", offersP: "", allOffers: "Բոլոր առաջարկները", offerValidity: "Գործողության ժամկետ", offerProjects: "Համապատասխան նախագծեր", offerOther: "Այլ գործող առաջարկներ", consult: "Խորհրդակցել վաճառքի բաժնի հետ", sources: "Պաշտոնական աղբյուրներ", ribbonText: "Ձևակերպեք ձեր հիփոթեքը մինչև 31․12․2026 և օգտվեք եկամտահարկի վերադրաձի օրեքնից։", previous: "Նախորդ", next: "Հաջորդ", slide: "սլայդ",
      plazaSoldOut: "Բոլոր բնակարանները վաճառված են", hillsUrgent: "Շտապեք․ մնացել է ընդամենը մի քանի բնակարան",
      aboutK: "Ընկերություն", aboutT: "25 տարվա փորձ՝ նյութից մինչև բնակելի միջավայր", aboutLead: "Milon Mining-ի պատմությունը կառուցված է շինարարության ամբողջ շղթայի իրական փորձի վրա՝ առևտուր, արտադրություն, ներմուծում, լոգիստիկա և զարգացում։",
      principlesT: "Մեր սկզբունքները", principles: [["Պատասխանատվություն", "Հստակ խոստումներ, ստուգելի տվյալներ և բաց հաղորդակցություն։"], ["Գործնական որակ", "Լուծումներ, որոնք գեղեցիկ են ոչ միայն առաջին օրը, այլ նաև տարիներ անց։"], ["Մարդկային մասշտաբ", "Ճարտարապետություն, որտեղ առօրյա ճանապարհները պարզ ու հարմար են։"]], historyT: "Զարգացման ուղի",
      parkingHeroT: "Կայանատեղին՝ ոչ թե հավելում, այլ համակարգ", parkingHeroP: "Հասկանալի մուտք, անվտանգ շարժում և նախագծին համապատասխան կայանման ձևաչափ՝ յուրաքանչյուր Milon բնակելի նախագծի համար։",
      parkingTypes: [["Ստորգետնյա", "Պաշտպանված կայանում և անմիջական կապ բնակելի հատվածի հետ՝ որտեղ այն նախատեսված է նախագծով։"], ["Վերգետնյա", "Կարճաժամկետ և բնակիչների համար նախատեսված տեղերի հստակ բաժանում։"], ["Անհատական ավտոտնակ", "Townhouse ձևաչափում մեքենայի տեղը տան մասն է և ունի ուղիղ մուտք։"]], parkingDetails: "Տեղերի քանակը, չափերը, արժեքը և հասանելիությունը տրամադրում է վաճառքի բաժինը ընտրված նախագծի համար։",
      privacyT: "Գաղտնիության քաղաքականություն", privacyIntro: "Այս էջը աշխատանքային կառուցվածք է և պետք է իրավաբանորեն հաստատվի մինչև կայքի հրապարակումը։", legalDraft: "Իրավական խմբագրումը սպասվում է",
      privacySections: [["Ինչ տվյալներ ենք ստանում", "Կապի ձևի միջոցով կարող ենք ստանալ ձեր անունը, հեռախոսահամարը, նախընտրելի կապի եղանակը և ընտրված նախագիծը կամ բնակարանը։"], ["Ինչու ենք մշակում տվյալները", "Տվյալներն օգտագործվում են հարցմանը պատասխանելու, խորհրդատվություն կազմակերպելու և բնակարանի ընտրության հետ կապված հաղորդակցության համար։"], ["Փոխանցում և պահպանում", "Վերջնական պահպանման ժամկետները, Bitrix24-ում մշակման կանոնները և երրորդ կողմերին փոխանցման հիմքերը պետք է սահմանվեն հաստատված իրավական փաստաթղթերով։"], ["Ձեր իրավունքները", "Տվյալների ճշտման կամ հեռացման հարցով կապվեք info@milonmining.am հասցեով։ Վերջնական ընթացակարգը պետք է հաստատվի իրավաբանի կողմից։"]],
      follow: "Հետևեք մեզ", rights: "Բոլոր իրավունքները պաշտպանված են", privacy: "Գաղտնիություն", accuracy: "Տվյալների արդիականությունը հաստատվում է վաճառքի բաժնում։"
    },
    ru: {
      projects: "Проекты", apartments: "Квартиры", offers: "Предложения", about: "О компании", parking: "Паркинг", contacts: "Контакты",
      choose: "Выбрать квартиру", heroK: "Жилые проекты в Абовяне и Ариндже", heroT: "Пространство, в котором раскрывается жизнь",
      heroP: "Milon Mining создаёт жилую среду, объединяя архитектуру, ежедневный комфорт и долгосрочную ценность в одно целое.", seeProjects: "Смотреть проекты", discover: "Исследовать",
      finderK: "Подбор квартиры", finderT: "Найдите свою будущую квартиру", finderP: "", project: "Проект", allProjects: "Все проекты", rooms: "Комнаты", any: "Любые",
      areaFrom: "Площадь от", areaTo: "Площадь до", priceFrom: "Стоимость от", priceTo: "Стоимость до", floors: "Этажи", allFloors: "Все этажи", reset: "Сбросить", show: "Показать", apt: "квартир",
      projectK: "Наши проекты", projectT: "Четыре адреса, один подход", projectP: "У Milon четыре разных проекта — с разным форматом жилья, расположением и окружением.", projectMore: "О проекте",
      companyK: "Milon Mining", companyT: "Мы строим не просто здания — мы создаём основу повседневной жизни", companyP: "С 2001 года компания прошла путь от строительных материалов до жилого девелопмента. Мы понимаем материал, процесс и ответственность, которая продолжается после заселения.", aboutCompany: "О компании",
      mapK: "Расположение", mapT: "Реальные адреса на реальной карте", mapP: "Сравните расположение проектов, расстояние от центра Еревана и ориентировочное время в пути.", mapOpen: "Открыть в Google Maps", mapDistance: "Расстояние от центра Еревана", mapTime: "Время на автомобиле", mapTimeNote: "Ориентировочно, без учёта пробок", projectOpen: "Перейти к проекту",
      comfortK: "Ежедневный комфорт", comfortT: "Продумано до обычных моментов", comfort: [["Безопасный двор", "Пешеходные, освещённые и контролируемые общественные пространства."], ["Надёжные системы", "Инженерные решения, рассчитанные на длительную эксплуатацию."], ["Паркинг", "Удобный въезд и сценарии парковки, соответствующие каждому проекту."], ["Инфраструктура рядом", "Образование, торговля, спорт и сервисы на разумном расстоянии."]],
      contactK: "Контакты", contactT: "Подобрать квартиру", contactP: "Оставьте номер и укажите удобный способ связи. Специалист ответит на вопросы и поможет с выбором.", name: "Имя", phone: "Телефон", method: "Предпочтительный способ связи", call: "Звонок", whatsapp: "WhatsApp", viber: "Viber", telegram: "Telegram",
      consent: "Я согласен с", privacyPolicy: "политикой конфиденциальности", and: "и", personal: "обработкой персональных данных", send: "Отправить заявку", pendingBackend: "Онлайн-отправка заработает после подключения Bitrix24. Сейчас можно позвонить нам:", sending: "Отправляем…", sent: "Спасибо. Заявка отправлена.", sendError: "Не удалось отправить. Позвоните нам или повторите попытку.",
      catalogK: "Каталог квартир", catalogT: "Выбирайте по данным, а не предполо­жениям", catalogP: "Сравнивайте квартиры по этажу, площади и стоимости. Актуальную доступность необходимо синхронизировать с системой продаж.",
      found: "Найдено", sort: "Сортировка", sortFloor: "Этаж: по убыванию", sortPrice: "Цена: по возрастанию", sortArea: "Площадь: по возрастанию", status: "Статус", no: "Квартира №", area: "Площадь", floor: "Этаж", price: "Стоимость", available: "Доступна", sold: "Продана", reserved: "Забронирована", book: "Забронировать", empty: "По этим параметрам опубликованных квартир нет. Измените фильтры или свяжитесь с нами.", bookingT: "Заявка на бронирование", selected: "Выбранная квартира", close: "Закрыть",
      unitPlan: "Планировка квартиры", floorPlan: "План этажа", projectRender: "Вид проекта", unitDetails: "Подробнее", openUnit: "Открыть карточку квартиры", galleryPosition: "Изображение", pageLabel: "Страница", previousPage: "Предыдущая страница", nextPage: "Следующая страница",
      completion: "Срок сдачи", galleryK: "Галерея", galleryT: "Архитектура и среда", benefitK: "Преимущества", benefitT: "Среда, которая работает каждый день", projectApts: "Квартиры в проекте", towerApts: "Выберите квартиру в Milon Tower", projectAptsP: "Полный список открывается в отдельном каталоге и не перегружает историю проекта.", catalogOpen: "Открыть каталог", soldOut: "Квартиры в этом проекте проданы. Мы поможем подобрать другой проект Milon.", unpublished: "Актуальный список квартир этого проекта пока не опубликован. Оставьте заявку для индивидуального предложения.",
      floorK: "Интерактивный выбор", floorT: "Выберите этаж прямо на фасаде", floorP: "Нажмите на этаж — выбор квартир откроется на этом же экране.", chooseFloor: "Выбрать этаж", back: "Назад", plan: "навигационная схема этажа", planNote: "Квартиры выбранного этажа показаны под схемой. Откройте карточку, чтобы посмотреть планировку и подробности.", floorNoUnits: "Актуальные данные квартир на этом этаже пока не опубликованы. Посмотрите полный каталог или свяжитесь с нами.",
      towerChooseT: "Выбрать квартиру", towerChooseP: "Найдите квартиру на интерактивной схеме здания или сравните все варианты в каталоге.", towerCatalogButton: "Посмотреть квартиры в каталоге", openCatalog: "Открыть каталог квартир", catalogMode: "Каталог", catalogMapMode: "Интерактивная карта", catalogSchemeIntro: "Квартиру в Milon Tower можно выбрать и по схеме здания, этажа и планировки — не покидая каталог.", catalogSchemeButton: "Выбрать по схеме здания", catalogFilters: "Фильтры", catalogBack: "Вернуться в каталог",
      finishK: "Отделка", finishT: "Основа для вашего интерьера", towerFinishT: "Отделка", finishP: "Квартиры передаются с предчистовой отделкой: выровненными поверхностями и основными инженерными вводами. Финальную комплектацию необходимо закрепить в договоре выбранной квартиры.", technical: "Реальные фотографии вентиляции, окон и инженерных узлов ожидаются от застройщика.",
      parkingK: "Паркинг", parkingT: "Комфортная жилая среда", towerParkingT: "Парковка рядом с домом", parkingP: "Комфортная жилая среда включает продуманные въезды, свободное передвижение и возможности для парковки. Подробности о количестве и условиях парковочных мест предоставляет отдел продаж.", parkingPage: "Страница паркинга", illustration: "Иллюстрация",
      progressK: "Обновления проекта", progressT: "Ход строительства", progressP: "Актуальные фотографии со стройплощадки будут публиковаться здесь после подтверждения этапов работ застройщиком.", monthPending: "Обновление ожидается", photoPending: "Фотография ожидается", statusPending: "Ожидаются актуальная фотография и подтверждённый статус застройщика", temporaryVisual: "Временный визуал проекта",
      purchaseK: "Варианты покупки", taxRefund: "Возврат подоходного налога", taxRefundP: "В Абовяне может действовать программа возврата: применимость зависит от покупателя и квартиры.", installment: "Рассрочка", installmentP: "Возможные условия и сроки уточняет отдел продаж.", mortgageCalc: "Ипотечный расчёт", mortgageCalcP: "Рассчитайте ориентировочный ежемесячный платёж на сайте.", mortgageHelp: "Помощь специалиста", mortgageHelpP: "Специалист поможет сравнить варианты и подготовить документы.", calculate: "Рассчитать", calculateMortgage: "Рассчитать ипотеку",
      mortgageT: "Предварительный расчёт ипотеки", mortgageIntro: "Расчёт является предварительным и не является предложением банка.", propertyPrice: "Стоимость квартиры, ֏", downPayment: "Первоначальный взнос", downAmount: "Сумма", downPercent: "Процент", termYears: "Срок кредита, лет", rate: "Годовая ставка, %", loanAmount: "Сумма кредита", monthlyPayment: "Ориентировочный ежемесячный платёж", perMonth: "в месяц", selectedApartment: "Выбранная квартира", mortgageInvalid: "Проверьте значения: взнос должен быть меньше стоимости квартиры, срок — от 1 до 50 лет, ставка — от 0 до 100%.", mortgageNoPrice: "Цена этой квартиры не опубликована. Для расчёта обратитесь в отдел продаж.",
      officeK: "Офис продаж", officeT: "Офис продаж — по пути из Еревана", officeP: "Приезжайте обсудить будущую квартиру в удобное для вас время. Офис находится в Ариндже — примерно в 11–15 минутах от центра Еревана без пробок.", officeRoute: "Построить маршрут", officeRouteNote: "Из Еревана — по направлению Севанского шоссе",
      towerLocationP: "Milon Tower расположен рядом с парками, церковью Святого Иоанна Крестителя, спортивной школой, фитнес-центром, каруселями, теннисным кортом и мэрией. Прямой въезд со стороны Еревана позволяет добраться домой, не пересекая весь город, а окружающая среда и продуманные повседневные маршруты создают ощущение спокойствия и безопасности.", neighborhoodT: "Ваш будущий район на карте",
      offersK: "Специальные условия", offersT: "Специальные предложения", offersP: "Выберите подходящий сценарий покупки и изучите действующие условия.", allOffers: "Все предложения", offerValidity: "Срок действия", offerProjects: "Подходящие проекты", offerOther: "Другие действующие предложения", consult: "Получить консультацию отдела продаж", sources: "Официальные источники", ribbonText: "Оформите ипотеку до 31.12.2026 и сохраните возможность возврата подоходного налога*", previous: "Назад", next: "Вперёд", slide: "слайд",
      plazaSoldOut: "Все квартиры проданы", hillsUrgent: "Спешите — осталось несколько квартир",
      aboutK: "Компания", aboutT: "25 лет опыта: от материала до жилой среды", aboutLead: "История Milon Mining построена на практическом знании всей строительной цепочки: торговля, производство, импорт, логистика и девелопмент.", principlesT: "Наши принципы", principles: [["Ответственность", "Ясные обещания, проверяемые данные и открытая коммуникация."], ["Практичное качество", "Решения, которые хороши не только в день открытия, но и годы спустя."], ["Человеческий масштаб", "Архитектура, где ежедневные маршруты остаются простыми и удобными."]], historyT: "Путь развития",
      parkingHeroT: "Паркинг — не дополнение, а система", parkingHeroP: "Понятный въезд, безопасное движение и подходящий проекту формат хранения автомобиля для каждого жилого проекта Milon.", parkingTypes: [["Подземный", "Защищённое хранение и прямая связь с жилой частью там, где этот формат предусмотрен проектом."], ["Наземный", "Понятное разделение кратковременных и резидентских мест."], ["Личный гараж", "В формате Townhouse место автомобиля становится частью дома и имеет прямой доступ."]], parkingDetails: "Количество, размеры, стоимость и доступность мест предоставляет отдел продаж для выбранного проекта.",
      privacyT: "Политика конфиденциальности", privacyIntro: "Эта страница содержит рабочую структуру и должна пройти юридическое утверждение до публикации сайта.", legalDraft: "Ожидается юридическая редакция", privacySections: [["Какие данные мы получаем", "Через форму связи мы можем получить имя, телефон, предпочтительный способ связи и выбранный проект или квартиру."], ["Зачем обрабатываем данные", "Данные используются для ответа на обращение, организации консультации и коммуникации по выбору квартиры."], ["Передача и хранение", "Сроки хранения, правила обработки в Bitrix24 и основания передачи третьим лицам должны быть закреплены в утверждённых документах Milon Mining."], ["Ваши права", "Для уточнения или удаления данных напишите на info@milonmining.am. Финальную процедуру необходимо утвердить у юриста."]],
      follow: "Следите за нами", rights: "Все права защищены", privacy: "Конфиденциальность", accuracy: "Актуальность данных подтверждается отделом продаж."
    }
  };

  const t = key => C[lang][key];
  const l = value => value && typeof value === "object" && (value.hy || value.ru) ? value[lang] : value;
  const a = file => {
    if (!file) return "";
    if (/^https?:\/\//.test(file)) return file;
    const mapped = D.assetMap && D.assetMap[file];
    if (mapped) return /^https?:\/\//.test(mapped) ? mapped : new URL(mapped, ROOT).href;
    return new URL(D.assetRoot.replace(/^\/+/, "") + file, ROOT).href;
  };
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[ch]);
  const money = value => new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "hy-AM").format(value) + " ֏";
  const sqm = value => Number(value).toLocaleString(lang === "ru" ? "ru-RU" : "hy-AM", {minimumFractionDigits:1, maximumFractionDigits:2}) + (lang === "ru" ? " м²" : " մ²");
  const calculateMortgage = (price, downPayment, years, annualRate) => {
    const principal=Math.max(0,Number(price)-Number(downPayment)),months=Number(years)*12,monthlyRate=Number(annualRate)/1200;
    if(!Number.isFinite(principal)||!Number.isFinite(months)||!Number.isFinite(monthlyRate)||principal<=0||months<=0||monthlyRate<0)return 0;
    if(monthlyRate===0)return principal/months;
    const factor=Math.pow(1+monthlyRate,months);
    return principal*monthlyRate*factor/(factor-1);
  };
  const link = href => {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
    const url = new URL(href.replace(/^\/+/, ""), ROOT); url.searchParams.set("lang", lang);
    return url.href;
  };
  const icon = name => ({arrow:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5"/></svg>',down:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5"/></svg>',back:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 10H5m4-5-5 5 5 5"/></svg>',close:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg>',menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',map:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg>'}[name] || "");
  const heading = (kicker, title, text="") => `<div class="section-heading"><span class="eyebrow">${kicker}</span><h2>${title}</h2>${text?`<p>${text}</p>`:""}</div>`;
  const offerHref = (offer, language=lang) => new URL(`${language}/offers/${offer.slug}/index.html`, ROOT).href;
  const offersHref = (language=lang) => new URL(`${language}/offers/index.html`, ROOT).href;
  const isOfferActive = offer => {
    if (!offer.active) return false;
    const now=Date.now(), start=offer.startDate?Date.parse(offer.startDate):null, end=offer.endDate?Date.parse(offer.endDate):null;
    return (start===null||Number.isFinite(start)&&now>=start)&&(end===null||Number.isFinite(end)&&now<=end);
  };
  const activeOffers = () => D.offers.filter(isOfferActive).sort((x,y)=>x.order-y.order);
  const visibleOffers = () => activeOffers().filter(offer=>offer.id!=="mortgage-calculator");

  function promoRibbon() {
    if(page==="about"||page==="parking")return "";
    const offer=activeOffers().find(item=>item.ribbon);
    if(!offer)return "";
    return `<aside class="promo-ribbon" aria-label="${t("offersT")}"><p>${t("ribbonText")}</p><a href="${offerHref(offer)}">${l(offer.button)}${icon("arrow")}</a></aside>`;
  }

  function header() {
    return `<a class="skip-link" href="#main">${lang === "ru" ? "К содержанию" : "Դեպի բովանդակություն"}</a><header class="site-header" data-header>
      <a class="brand" href="${link("index.html")}" aria-label="Milon Mining"><img src="${a("logo_milon.png")}" alt="Milon Mining"><span><b>MILON MINING</b></span></a>
      <nav class="desktop-nav" aria-label="Main"><a href="${link("index.html#projects")}">${t("projects")}</a><a href="${link("apartments.html")}">${t("apartments")}</a><a href="${offersHref()}">${t("offers")}</a><a href="${link("about.html")}">${t("about")}</a><a href="${link("parking.html")}">${t("parking")}</a><a href="#contacts">${t("contacts")}</a></nav>
      <div class="header-actions"><a class="header-phone" href="tel:${D.contacts.mobile.replace(/\s/g,"")}">${D.contacts.mobile}</a><button class="language-switch" type="button" data-language>${lang === "ru" ? "HY" : "RU"}</button><a class="button button--small button--light desktop-cta" href="${link("apartments.html")}">${t("choose")}${icon("arrow")}</a><button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu"><span>Menu</span>${icon("menu")}</button></div>
    </header>${promoRibbon()}<div class="mobile-menu" id="mobile-menu" data-mobile-menu aria-hidden="true"><nav><a href="${link("index.html#projects")}">${t("projects")}</a><a href="${link("apartments.html")}">${t("apartments")}</a><a href="${offersHref()}">${t("offers")}</a><a href="${link("about.html")}">${t("about")}</a><a href="${link("parking.html")}">${t("parking")}</a><a href="#contacts">${t("contacts")}</a></nav><div class="mobile-menu__footer"><a href="tel:${D.contacts.mobile.replace(/\s/g,"")}">${D.contacts.mobile}</a><a href="mailto:${D.contacts.email}">${D.contacts.email}</a></div></div>`;
  }

  function footer() {
    return `<footer class="site-footer" id="contacts"><div class="footer-main page-shell"><div class="footer-brand"><span class="footer-wordmark">MILON <i>MINING</i></span><p>${l(D.contacts.address)}</p></div><div class="footer-contacts"><a href="tel:${D.contacts.phone.replace(/\s/g,"")}">${D.contacts.phone}</a><a href="tel:${D.contacts.mobile.replace(/\s/g,"")}">${D.contacts.mobile}</a><a href="mailto:${D.contacts.email}">${D.contacts.email}</a></div><div class="footer-links"><span>${t("follow")}</span><a href="${D.contacts.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${D.contacts.facebook}" target="_blank" rel="noopener">Facebook</a></div></div><div class="footer-bottom page-shell"><span>© ${new Date().getFullYear()} Milon Mining. ${t("rights")}.</span><span>${t("accuracy")}</span><a href="${link("privacy-policy.html")}">${t("privacy")}</a></div></footer>`;
  }

  function filters(overrides={}) {
    return {project:overrides.project || query.get("project") || "all", rooms:overrides.rooms || (query.get("rooms") ? query.get("rooms").split(",") : []), areaMin:overrides.areaMin || query.get("areaMin") || "", areaMax:overrides.areaMax || query.get("areaMax") || "", priceMin:overrides.priceMin || query.get("priceMin") || "", priceMax:overrides.priceMax || query.get("priceMax") || "", floors:overrides.floors || (query.get("floors") ? query.get("floors").split(",") : [])};
  }
  function filterUnits(f) {
    const amin=Number(f.areaMin)||-Infinity, amax=Number(f.areaMax)||Infinity, pmin=(Number(f.priceMin)||-Infinity)*1e6, pmax=(Number(f.priceMax)||Infinity)*1e6;
    const rooms=Array.isArray(f.rooms)?f.rooms:(f.rooms&&f.rooms!=="all"?[String(f.rooms)]:[]);
    return D.units.filter(u => (f.project==="all"||u.project===f.project) && (!rooms.length||rooms.includes(String(u.rooms))) && u.area>=amin && u.area<=amax && u.price>=pmin && u.price<=pmax && (!f.floors.length||f.floors.includes(String(u.floor))));
  }
  function readFilters(form) { const fd=new FormData(form); return {project:fd.get("project")||"all",rooms:fd.getAll("rooms"),areaMin:fd.get("areaMin")||"",areaMax:fd.get("areaMax")||"",priceMin:fd.get("priceMin")||"",priceMax:fd.get("priceMax")||"",floors:fd.getAll("floors")}; }
  function roomSummary(f) { return !f.rooms.length?t("any"):f.rooms.join(", "); }
  function floorSummary(f) { return !f.floors.length?t("allFloors"):f.floors.length===1?`${f.floors[0]} ${lang==="ru"?"этаж":"հարկ"}`:`${f.floors.length} ${lang==="ru"?"этажа":"հարկ"}`; }
  function unitNumber(unit) { return String(unit.number || unit.id); }
  function unitGallery(unit) {
    const project=D.projects[unit.project], images=[
      {src:a(unit.planImage || "plan-placeholder.svg"),label:t("unitPlan")},
      {src:a(unit.floorImage || unit.planImage || "plan-placeholder.svg"),label:t("floorPlan")},
      {src:a(project.card),label:t("projectRender")}
    ];
    return images.filter((item,index,all)=>all.findIndex(candidate=>candidate.src===item.src)===index);
  }
  function finder(mode="home", initial=filters()) {
    const floorList=[...new Set(D.units.map(u=>u.floor))].sort((x,y)=>x-y), roomList=[...new Set(D.units.map(u=>u.rooms))].sort((x,y)=>x-y);
    return `<form class="finder finder--${mode}" data-finder data-mode="${mode}"><div class="field"><label>${t("project")}</label><select name="project"><option value="all">${t("allProjects")}</option>${Object.values(D.projects).map(p=>`<option value="${p.key}" ${initial.project===p.key?"selected":""}>${p.name}</option>`).join("")}</select></div><div class="field field--rooms"><label>${t("rooms")}</label><details class="filter-multiselect room-select"><summary><span data-room-summary>${roomSummary(initial)}</span>${icon("down")}</summary><div class="filter-options room-options"><button type="button" class="filter-clear" data-clear-filter="rooms">${t("any")}</button>${roomList.map(n=>`<label><input type="checkbox" name="rooms" value="${n}" ${initial.rooms.includes(String(n))?"checked":""}><span>${n}</span></label>`).join("")}</div></details></div>
      <div class="field-pair"><div class="field"><label>${t("areaFrom")}</label><div class="input-unit"><input name="areaMin" type="number" min="0" value="${esc(initial.areaMin)}" placeholder="35"><span>м²</span></div></div><div class="field"><label>${t("areaTo")}</label><div class="input-unit"><input name="areaMax" type="number" min="0" value="${esc(initial.areaMax)}" placeholder="180"><span>м²</span></div></div></div>
      <div class="field-pair"><div class="field"><label>${t("priceFrom")}</label><div class="input-unit"><input name="priceMin" type="number" min="0" value="${esc(initial.priceMin)}" placeholder="28"><span>${lang==="ru"?"млн":"մլն"}</span></div></div><div class="field"><label>${t("priceTo")}</label><div class="input-unit"><input name="priceMax" type="number" min="0" value="${esc(initial.priceMax)}" placeholder="86"><span>${lang==="ru"?"млн":"մլն"}</span></div></div></div>
      <div class="field field--floors"><label>${t("floors")}</label><details class="filter-multiselect floor-select"><summary><span data-floor-summary>${floorSummary(initial)}</span>${icon("down")}</summary><div class="filter-options floor-options"><button type="button" class="filter-clear" data-clear-filter="floors">${t("allFloors")}</button>${floorList.map(n=>`<label><input type="checkbox" name="floors" value="${n}" ${initial.floors.includes(String(n))?"checked":""}><span>${n}</span></label>`).join("")}</div></details></div><div class="finder-actions"><button class="reset-button" type="reset">${t("reset")}</button><button class="button button--dark finder-submit" type="submit" data-result-button>${t("show")}${icon("arrow")}</button></div></form>`;
  }

  function mapBlock(project=D.projects.tower, home=false) {
    const points=home?Object.values(D.projects).map(p=>({label:p.name,query:p.mapQuery})):project.key==="tower"?[{label:"Milon Tower",query:project.mapQuery},{label:"Abovyan Fitness Center & School",query:"Abovyan Fitness Center and School, Abovyan, Armenia"},{label:lang==="ru"?"Площадь Дружбы":"Բարեկամության հրապարակ",query:"Friendship Square, Abovyan, Armenia"}]:[{label:project.name,query:project.mapQuery}];
    return `<div class="location-map" data-map><div class="map-toolbar">${points.map((p,i)=>`<button type="button" class="${i?"":"is-active"}" data-map-query="${esc(p.query)}">${icon("map")}${esc(p.label)}</button>`).join("")}</div><div class="map-frame"><iframe title="Map" src="https://www.google.com/maps?q=${encodeURIComponent(project.mapQuery)}&t=k&z=17&output=embed" loading="lazy"></iframe><span class="map-badge">SATELLITE · REAL GEOMETRY</span></div><a class="text-link" data-map-external href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.mapQuery)}" target="_blank" rel="noopener">${t("mapOpen")}${icon("arrow")}</a></div>`;
  }

  function projectMapCard(p) {
    const info=D.projectMap[p.key];
    return `<div class="project-map-card__head"><span>${t("mapK")}</span><h3>${p.name}</h3><p>${l(info.intro)}</p></div><dl><div><dt>${t("mapDistance")}</dt><dd>${l(info.distance)}</dd></div><div><dt>${t("mapTime")}</dt><dd>${l(info.time)}<small>${t("mapTimeNote")}</small></dd></div></dl><ul>${info.benefits[lang].map(item=>`<li>${item}</li>`).join("")}</ul><a class="button button--dark" href="${link(p.href)}">${t("projectOpen")}${icon("arrow")}</a>`;
  }

  function homeProjectMap() {
    const projects=Object.values(D.projects), first=projects[0];
    return `<div class="project-map-layout" data-project-map><div class="project-map-visual"><iframe title="${t("mapT")}" src="https://www.google.com/maps?q=${encodeURIComponent(first.mapQuery)}&z=13&output=embed" loading="lazy"></iframe><div class="project-map-tabs" role="list">${projects.map((p,i)=>`<button type="button" role="listitem" class="${i?"":"is-active"}" data-project-map-select="${p.key}">${icon("map")}<span>${p.name}</span></button>`).join("")}</div><span class="map-badge">ROAD MAP</span></div><aside class="project-map-card" data-project-map-card>${projectMapCard(first)}</aside></div>`;
  }

  function offerCard(offer) {
    return `<article class="offer-card"><a href="${offerHref(offer)}"><div class="offer-card__image"><img src="${a(offer.image)}" alt="${esc(l(offer.title))}" loading="lazy"><span>${l(offer.type)}</span></div><div class="offer-card__copy"><h3>${l(offer.title)}</h3><p>${l(offer.summary)}</p><em>${l(offer.button)}${icon("arrow")}</em></div></a></article>`;
  }

  function offersSection() {
    const offers=visibleOffers();
    if(!offers.length)return "";
    return `<section class="offers-section section-pad" id="offers"><div class="page-shell"><div class="offers-heading">${heading(t("offersK"),t("offersT"),t("offersP"))}<a class="text-link" href="${offersHref()}">${t("allOffers")}${icon("arrow")}</a></div><div class="content-carousel offer-carousel" data-carousel><div class="carousel-track" data-carousel-track>${offers.map(offerCard).join("")}</div><div class="carousel-controls"><button type="button" data-carousel-prev aria-label="${t("previous")}">${icon("back")}</button><span><b data-carousel-current>1</b> / ${offers.length}</span><button type="button" data-carousel-next aria-label="${t("next")}">${icon("arrow")}</button></div></div></div></section>`;
  }

  function salesOfficeSection() {
    const office=D.salesOffice, route=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(office.mapQuery)}`;
    return `<section class="sales-office section-pad" id="sales-office"><div class="page-shell sales-office__layout"><div class="sales-office__copy">${heading(t("officeK"),t("officeT"),t("officeP"))}<address>${l(office.address)}</address><span class="office-route-note">${icon("map")}${t("officeRouteNote")}</span><a class="button button--dark" href="${route}" target="_blank" rel="noopener">${t("officeRoute")}${icon("arrow")}</a></div><div class="sales-office__map"><iframe title="${t("officeT")}" src="https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&z=15&output=embed" loading="lazy"></iframe><span class="map-badge">${t("officeK")}</span></div></div></section>`;
  }

  function leadForm(context={}) {
    return `<form class="lead-form" data-lead-form data-project="${esc(context.project||"")}" data-apartment="${esc(context.apartment||"")}" novalidate><div class="lead-fields"><label class="field"><span>${t("name")}</span><input name="name" autocomplete="name" required minlength="2"></label><label class="field"><span>${t("phone")}</span><input name="phone" type="tel" autocomplete="tel" required placeholder="+374 __ ___ ___"></label></div><fieldset class="contact-methods"><legend>${t("method")}</legend>${["call","whatsapp","viber","telegram"].map((m,i)=>`<label><input type="radio" name="preferred_contact_method" value="${m}" ${i?"":"checked"}><span>${t(m)}</span></label>`).join("")}</fieldset><label class="consent"><input type="checkbox" name="consent" required><span>${t("consent")} <a href="${link("privacy-policy.html")}" target="_blank">${t("privacyPolicy")}</a> ${t("and")} <a href="${link("privacy-policy.html#personal-data")}" target="_blank">${t("personal")}</a>.</span></label><button class="button button--accent" type="submit">${t("send")}${icon("arrow")}</button><div class="form-status" role="status" aria-live="polite" data-form-status></div></form>`;
  }
  function contactSection(context={}) { return `<section class="contact-section section-pad"><div class="page-shell contact-layout"><div>${heading(t("contactK"),t("contactT"),t("contactP"))}<div class="direct-contact"><a href="tel:${D.contacts.mobile.replace(/\s/g,"")}">${D.contacts.mobile}</a><a href="mailto:${D.contacts.email}">${D.contacts.email}</a></div></div>${leadForm(context)}</div></section>`; }

  function projectStatusBadge(p, context="card") {
    if(p.key==="hills"||p.key==="tower")return `<span class="project-special-status project-special-status--sold project-special-status--${context}"><b>${lang==="ru"?"СТРОИТСЯ":"ԿԱՌՈՒՑՎՈՒՄ Է"}</b></span>`;
    if(p.key==="plaza"||p.key==="townhouse")return `<span class="project-special-status project-special-status--sold project-special-status--${context}"><b>${lang==="ru"?"СДАН":"ՊԱՏՐԱՍՏ Է"}</b></span>`;
    return "";
  }
  function projectCard(p) { return `<article class="project-card project-card--${p.key}"><a href="${link(p.href)}"><img src="${a(p.card)}" alt="${p.name}" loading="lazy"><span class="project-card__shade"></span>${projectStatusBadge(p)}<span class="project-card__top"><i>${l(p.status)}</i><i>${l(p.completion)}</i></span><span class="project-card__content"><span>${l(p.location)}</span><strong>${p.name}</strong><em>${t("projectMore")}${icon("arrow")}</em></span></a></article>`; }

  function mortgageCalculatorContent(unit) {
    const project=unit?D.projects[unit.project]:D.projects.tower, price=Number(unit?.price)||0, down=price?Math.round(price*.2/100000)*100000:0;
    const unavailable=price?"":" disabled aria-disabled=\"true\"";
    return `<span class="eyebrow">${project.name}</span><h2>${t("mortgageT")}</h2>${unit?`<div class="mortgage-unit"><span>${t("selectedApartment")}</span><strong>№ ${esc(unitNumber(unit))}</strong></div>`:""}<p class="mortgage-intro">${price?t("mortgageIntro"):t("mortgageNoPrice")}</p><form class="mortgage-calculator" data-mortgage-calculator data-unit-id="${esc(unit?.id||"")}"><label class="mortgage-price"><span>${t("propertyPrice")}</span><input type="number" name="price" min="1" max="10000000000" step="100000" value="${price||""}" inputmode="numeric" readonly></label><div class="mortgage-down"><label><span>${t("downPayment")}</span><input type="number" name="down" min="0" step="100000" value="${down}" inputmode="numeric"${unavailable}></label><label><span>${lang==="ru"?"Формат":"Ձևաչափ"}</span><select name="downType"${unavailable}><option value="amount">${t("downAmount")}</option><option value="percent">${t("downPercent")}</option></select></label></div><label><span>${t("termYears")}</span><input type="number" name="years" min="1" max="50" step="1" value="20" inputmode="numeric"${unavailable}></label><label><span>${t("rate")}</span><input type="number" name="rate" min="0" max="100" step="0.1" value="13.5" inputmode="decimal"${unavailable}></label><div class="mortgage-result mortgage-result--loan"><span>${t("loanAmount")}</span><output data-mortgage-loan>—</output></div><div class="mortgage-result"><span>${t("monthlyPayment")}</span><output data-mortgage-payment>—</output><small>${t("perMonth")}</small></div><p class="mortgage-error" data-mortgage-error role="status"></p></form>`;
  }

  function mortgageDialog() {
    const defaultUnit=D.units.find(unit=>unit.price)||null;
    return `<dialog class="modal mortgage-modal" data-mortgage-dialog><button class="modal-close" type="button" data-dialog-close aria-label="${t("close")}">${icon("close")}</button><div data-mortgage-content>${mortgageCalculatorContent(defaultUnit)}</div></dialog>`;
  }

  function dialogs() {
    return `<dialog class="modal booking-modal" data-booking-dialog><button class="modal-close" type="button" data-dialog-close aria-label="${t("close")}">${icon("close")}</button><span class="eyebrow">Milon Mining</span><h2>${t("bookingT")}</h2><p class="selected-unit" data-selected-unit></p><div data-booking-form></div></dialog><dialog class="modal gallery-modal" data-gallery-dialog><button class="modal-close modal-close--over" type="button" data-dialog-close>${icon("close")}</button><img src="" alt="" data-gallery-full></dialog>${unitDetailDialog()}${mortgageDialog()}`;
  }

  function homePage() {
    const p=D.projects.tower;
    const comfortImages=["am-2.jpg","finish-real.jpg","parking-1.jpg","am-3.jpg"];
    return `${header()}<main id="main"><section class="hero hero--home">${p.video?`<video class="hero-media" autoplay muted loop playsinline poster="${a(p.poster)}"><source src="${a(p.video)}" type="video/mp4"></video>`:`<img class="hero-media" src="${a(p.poster||p.hero)}" alt="${esc(p.name)}">`}<div class="hero-shade"></div><div class="hero-content page-shell"><span class="hero-kicker">${t("heroK")}</span><h1>${t("heroT")}</h1><p>${t("heroP")}</p><div class="hero-actions"><a class="button button--accent" href="#finder">${t("choose")}${icon("arrow")}</a><a class="text-link text-link--light" href="#projects">${t("seeProjects")}${icon("arrow")}</a></div></div><a class="hero-scroll" href="#finder"><span>${t("discover")}</span><i></i></a></section>
      ${offersSection()}
      <section class="projects-section section-pad" id="projects"><div class="page-shell">${heading(t("projectK"),t("projectT"),t("projectP"))}<div class="project-grid">${Object.values(D.projects).map(projectCard).join("")}</div></div></section>
      <section class="comfort-section section-pad"><div class="page-shell">${heading(t("comfortK"),t("comfortT"))}<div class="comfort-grid">${t("comfort").map((x,i)=>`<article><div class="comfort-image"><img src="${a(comfortImages[i])}" alt="${esc(x[0])}" loading="lazy"></div><div class="comfort-copy"><span>0${i+1}</span><h3>${x[0]}</h3><p>${x[1]}</p></div></article>`).join("")}</div></div></section>
      <section class="finder-section section-pad" id="finder"><div class="page-shell">${heading(t("finderK"),t("finderT"),t("finderP"))}${finder()}</div></section>
      <section class="company-section section-pad"><div class="page-shell company-layout"><div class="company-media"><img src="${a("am-1.jpg")}" alt="Milon Mining" loading="lazy"><span>EST. 2001</span></div><div class="company-copy">${heading(t("companyK"),t("companyT"),t("companyP"))}<a class="text-link" href="${link("about.html")}">${t("aboutCompany")}${icon("arrow")}</a></div></div></section>
      ${salesOfficeSection()}
      <section class="map-section section-pad" id="project-map"><div class="page-shell">${heading(t("mapK"),t("mapT"),t("mapP"))}${homeProjectMap()}</div></section>
      ${contactSection()}</main>${footer()}${dialogs()}`;
  }

  function unitDetailContent(unit) {
    const project=D.projects[unit.project], gallery=unitGallery(unit), number=unitNumber(unit);
    return `<div class="unit-detail"><div class="unit-detail__gallery" data-unit-gallery data-gallery-index="0"><div class="unit-detail__stage"><img src="${gallery[0].src}" alt="${esc(`${gallery[0].label} № ${number}`)}" data-unit-gallery-image><span data-unit-gallery-label>${gallery[0].label}</span><button type="button" class="unit-detail__arrow unit-detail__arrow--prev" data-unit-gallery-prev aria-label="${t("previous")}">${icon("back")}</button><button type="button" class="unit-detail__arrow unit-detail__arrow--next" data-unit-gallery-next aria-label="${t("next")}">${icon("arrow")}</button></div><div class="unit-detail__thumbs" role="tablist" aria-label="${t("galleryT")}">${gallery.map((item,index)=>`<button type="button" role="tab" aria-selected="${index===0}" class="${index===0?"is-active":""}" data-unit-gallery-thumb="${index}" data-gallery-src="${item.src}" data-gallery-label="${esc(item.label)}"><img src="${item.src}" alt="" loading="${index===0?"eager":"lazy"}"><span>${item.label}</span></button>`).join("")}</div></div><div class="unit-detail__copy"><span class="eyebrow">${project.name}</span><div class="unit-detail__title"><h2>${t("no")} ${esc(number)}</h2><span class="status status--${unit.status}">${t(unit.status)}</span></div><dl class="unit-detail__facts"><div><dt>${t("rooms")}</dt><dd>${unit.rooms}</dd></div><div><dt>${t("floor")}</dt><dd>${unit.floor} / ${unit.totalFloors}</dd></div><div><dt>${t("area")}</dt><dd>${sqm(unit.area)}</dd></div><div><dt>${t("price")}</dt><dd>${unit.price?money(unit.price):"—"}</dd></div></dl>${unit.oldPrice?`<p class="unit-detail__discount"><s>${money(unit.oldPrice)}</s><span>−${unit.discount}%</span></p>`:""}<div class="unit-detail__actions"><button class="button button--dark" type="button" data-book="${unit.id}">${t("book")}${icon("arrow")}</button><button class="button button--outline" type="button" data-mortgage-open="${unit.id}">${t("calculateMortgage")}</button></div></div></div>`;
  }

  function unitDetailDialog() {
    return `<dialog class="modal unit-detail-modal" data-unit-dialog aria-label="${t("unitDetails")}"><button class="modal-close" type="button" data-dialog-close aria-label="${t("close")}">${icon("close")}</button><div data-unit-detail-content></div></dialog>`;
  }

  function unitRow(u) {
    const p=D.projects[u.project], number=unitNumber(u), planSrc=a(u.planImage || "plan-placeholder.svg"), floorSrc=a(u.floorImage || u.planImage || "plan-placeholder.svg"), planAlt=lang==="ru"?`Планировка квартиры ${number}`:`${number} բնակարանի հատակագիծ`;
    return `<article class="unit-card" data-unit="${u.id}"><button class="unit-card__open" type="button" data-unit-open="${u.id}" aria-label="${t("openUnit")} № ${esc(number)}"></button><div class="unit-card__media" data-unit-card-media><img src="${planSrc}" alt="${esc(planAlt)}" loading="lazy" data-unit-card-image><div class="unit-card__media-tabs" aria-label="${t("galleryT")}"><button class="is-active" type="button" data-unit-card-src="${planSrc}" data-unit-card-alt="${esc(planAlt)}">${t("unitPlan")}</button><button type="button" data-unit-card-src="${floorSrc}" data-unit-card-alt="${esc(`${t("floorPlan")} ${u.floor}`)}">${t("floorPlan")}</button></div></div><div class="unit-card__body"><div class="unit-card__head"><div><small>${p.name}</small><h3>${t("no")} ${esc(number)}</h3></div><span class="status status--${u.status}">${t(u.status)}</span></div><dl class="unit-card__facts"><div><dt>${t("rooms")}</dt><dd>${u.rooms}</dd></div><div><dt>${t("floor")}</dt><dd>${u.floor} / ${u.totalFloors}</dd></div><div><dt>${t("area")}</dt><dd>${sqm(u.area)}</dd></div></dl><div class="unit-card__price"><small>${t("price")}</small><strong>${u.price?money(u.price):"—"}</strong>${u.oldPrice?`<span><s>${money(u.oldPrice)}</s> −${u.discount}%</span>`:""}</div><div class="unit-actions"><button class="button button--dark book-button" type="button" data-book="${u.id}">${t("book")}${icon("arrow")}</button><button class="mortgage-button" type="button" data-mortgage-open="${u.id}">${t("calculateMortgage")}</button></div></div></article>`;
  }

  function sortCatalogUnits(units, sort="floor-desc") {
    return [...units].sort(sort==="price-asc"?(x,y)=>x.price-y.price:sort==="area-asc"?(x,y)=>x.area-y.area:(x,y)=>y.floor-x.floor || x.project.localeCompare(y.project));
  }

  function catalogPagination(total) {
    const pages=Math.ceil(total/CATALOG_PAGE_SIZE);
    if(pages<=1)return "";
    const numbers=Array.from({length:pages},(_,index)=>index+1);
    return `<nav class="catalog-pagination" aria-label="${t("pageLabel")}" data-catalog-pagination><button type="button" data-catalog-page="${Math.max(1,catalogPageNumber-1)}" ${catalogPageNumber===1?"disabled":""} aria-label="${t("previousPage")}">${icon("back")}</button>${numbers.map(number=>`<button type="button" data-catalog-page="${number}" class="${number===catalogPageNumber?"is-active":""}" ${number===catalogPageNumber?'aria-current="page"':""}>${number}</button>`).join("")}<button type="button" data-catalog-page="${Math.min(pages,catalogPageNumber+1)}" ${catalogPageNumber===pages?"disabled":""} aria-label="${t("nextPage")}">${icon("arrow")}</button></nav>`;
  }

  function catalogCards(units) {
    const pages=Math.max(1,Math.ceil(units.length/CATALOG_PAGE_SIZE));
    catalogPageNumber=Math.min(pages,Math.max(1,catalogPageNumber));
    const start=(catalogPageNumber-1)*CATALOG_PAGE_SIZE, visible=units.slice(start,start+CATALOG_PAGE_SIZE);
    return visible.length?visible.map(unitRow).join(""):`<div class="empty-state">${t("empty")}</div>`;
  }

  function catalogPage() {
    const initial=filters(), units=sortCatalogUnits(filterUnits(initial));
    catalogPageNumber=Math.min(Math.max(1,Math.ceil(units.length/CATALOG_PAGE_SIZE)),catalogPageNumber);
    const catalogTabs=`<div class="catalog-tower-tools" data-tower-catalog-tools><div class="catalog-view-switch" role="tablist" aria-label="${t("towerChooseT")}"><button class="is-active" type="button" role="tab" aria-selected="true" aria-controls="catalog-scheme" data-catalog-view="scheme">${t("catalogMapMode")}</button><button type="button" role="tab" aria-selected="false" aria-controls="catalog-list" tabindex="-1" data-catalog-view="list">${t("catalogMode")}</button></div><p><strong>Milon Tower</strong> · ${t("catalogSchemeIntro")}</p></div>`;
    return `${header()}<main id="main"><section class="page-hero page-hero--catalog"><div class="page-shell"><span class="eyebrow">${t("catalogK")}</span><h1>${t("catalogT")}</h1><p>${t("catalogP")}</p></div></section><section class="catalog-section section-pad"><div class="page-shell">${catalogTabs}<div data-catalog-list-view id="catalog-list" role="tabpanel" hidden><section class="catalog-filter-panel" aria-labelledby="catalog-filter-title"><h2 id="catalog-filter-title">${t("catalogFilters")}</h2>${finder("catalog",initial)}</section><section class="catalog-results" aria-live="polite"><div class="catalog-toolbar"><p><span>${t("found")}</span> <strong data-catalog-count>${units.length}</strong> ${t("apt")}</p><label><span>${t("sort")}</span><select data-sort><option value="floor-desc">${t("sortFloor")}</option><option value="price-asc">${t("sortPrice")}</option><option value="area-asc">${t("sortArea")}</option></select></label></div><div class="unit-list" data-unit-list>${catalogCards(units)}</div><div data-catalog-pagination-root>${catalogPagination(units.length)}</div></section></div><div class="catalog-scheme-view" id="catalog-scheme" role="tabpanel" data-catalog-scheme-view>${floorStage(D.projects.tower,{catalog:true})}</div></div></section>${contactSection()}</main>${footer()}${dialogs()}`;
  }

  function offerProjectLinks(offer) {
    return `<div class="offer-project-links">${offer.projects.map(key=>{const p=D.projects[key];return p?`<a href="${link(p.href)}"><span>${p.name}</span><small>${l(p.location)}</small>${icon("arrow")}</a>`:"";}).join("")}</div>`;
  }

  function offerUnitPicker(offer) {
    if(offer.id!=="mortgage-calculator")return "";
    const units=D.units.filter(u=>offer.projects.includes(u.project)&&u.price);
    return `<section class="offer-unit-picker"><div>${heading(t("finderK"),lang==="ru"?"Выберите квартиру для расчёта":"Ընտրեք բնակարանը հաշվարկի համար",lang==="ru"?"Стоимость выбранного варианта сразу откроется в ипотечном калькуляторе.":"Ընտրված տարբերակի արժեքը անմիջապես կբացվի հիփոթեքային հաշվիչում։")}</div><div>${units.map(u=>`<button type="button" data-mortgage-open="${u.id}"><span>№ ${unitNumber(u)}</span><strong>${money(u.price)}</strong><small>${u.rooms} ${lang==="ru"?"комн.":"սեն."} · ${sqm(u.area)}</small></button>`).join("")}</div></section>`;
  }

  function offersIndexPage() {
    const offers=visibleOffers();
    return `${header()}<main id="main"><section class="page-hero offers-hero"><div class="page-shell"><span class="eyebrow">Milon Mining</span><h1>${t("offersT")}</h1><p>${t("offersP")}</p></div></section><section class="offers-index section-pad"><div class="page-shell"><div class="offers-grid">${offers.map(offerCard).join("")}</div></div></section>${contactSection()}</main>${footer()}${dialogs()}`;
  }

  function offerPage(offer) {
    const others=visibleOffers().filter(item=>item.id!==offer.id), active=isOfferActive(offer);
    const expiredCopy=lang==="ru"?"Предложение завершено. Актуальные условия можно уточнить в отделе продаж.":"Առաջարկն ավարտված է։ Արդիական պայմանները կարող եք ճշտել վաճառքի բաժնում։";
    return `${header()}<main id="main"><section class="offer-hero"><img src="${a(offer.image)}" alt="${esc(l(offer.title))}"><div class="hero-shade"></div><div class="page-shell"><span class="eyebrow">${l(offer.type)}</span><h1>${l(offer.title)}</h1><p>${l(offer.advantage)}</p></div></section><section class="offer-details section-pad"><div class="page-shell offer-details__layout"><article><span class="eyebrow">${t("offerValidity")}</span><h2>${l(offer.validity)}</h2><p>${active?l(offer.details):expiredCopy}</p><div class="offer-actions"><a class="button button--dark" href="${link(`apartments.html${offer.projects.length===1?`?project=${offer.projects[0]}`:""}`)}">${t("openCatalog")}${icon("arrow")}</a><a class="button button--outline" href="#contacts">${t("consult")}${icon("arrow")}</a></div>${offer.legal?`<p class="offer-legal">${l(offer.legal)}</p>`:""}${offer.sources?.length?`<div class="offer-sources"><span>${t("sources")}</span>${offer.sources.map((source,i)=>`<a href="${source}" target="_blank" rel="noopener">${i===0?"ՀՀ ՊԵԿ":"Hartak.am"}${icon("arrow")}</a>`).join("")}</div>`:""}</article><aside><span class="eyebrow">${t("offerProjects")}</span>${offerProjectLinks(offer)}</aside></div>${offerUnitPicker(offer)}</section>${others.length?`<section class="other-offers section-pad"><div class="page-shell">${heading(t("offersK"),t("offerOther"))}<div class="content-carousel offer-carousel" data-carousel><div class="carousel-track" data-carousel-track>${others.map(offerCard).join("")}</div><div class="carousel-controls"><button type="button" data-carousel-prev aria-label="${t("previous")}">${icon("back")}</button><span><b data-carousel-current>1</b> / ${others.length}</span><button type="button" data-carousel-next aria-label="${t("next")}">${icon("arrow")}</button></div></div></div></section>`:""}${contactSection()}</main>${footer()}${dialogs()}`;
  }

  function projectHero(p) {
    const media=p.video?`<video class="hero-media" autoplay muted loop playsinline poster="${a(p.poster)}"><source src="${a(p.video)}" type="video/mp4"></video>`:`<img class="hero-media" src="${a(p.hero)}" alt="${p.name}">`;
    return `<section class="project-hero">${media}<div class="hero-shade"></div>${projectStatusBadge(p,"hero")}<div class="page-shell project-hero__content"><div class="project-hero__lead"><span class="hero-kicker">${l(p.eyebrow)}</span><h1>${p.name}</h1><p>${l(p.title)}</p></div><div class="project-hero__meta"><span>${l(p.location)}</span><span>${t("completion")}: <strong>${l(p.completion)}</strong></span></div></div></section>`;
  }

  function facadeFloors(p,floorList) {
    const f=window.MILON_FACADES&&window.MILON_FACADES[p.key];
    if(!f)return "";
    // размеченные полигоны используем только если покрыт каждый этаж проекта,
    // иначе часть этажей стала бы недоступной — тогда остаётся обычная рейка
    if(!floorList.every(n=>f.floors[n]))return "";
    const word=lang==="ru"?"этаж":"հարկ";
    const shapes=floorList.map(n=>{
      const points=f.floors[n].map(pt=>pt.join(",")).join(" ");
      return `<polygon class="facade-floor" points="${points}" data-floor="${n}" tabindex="0" role="button" aria-label="${n} ${word}"><title>${n} ${word}</title></polygon>`;
    }).join("");
    // slice — это SVG-аналог object-fit: cover, которым выводится фотография,
    // поэтому слой обрезается ровно так же и совпадает с ней
    return `<svg class="facade-floors" viewBox="0 0 ${f.w} ${f.h}" preserveAspectRatio="xMidYMid slice">${shapes}</svg>`;
  }

  function floorStage(p,{catalog=false}={}) {
    const unitFloors=[...new Set(D.units.filter(u=>u.project===p.key).map(u=>u.floor))].sort((x,y)=>y-x);
    const floorList=catalog&&p.key==="tower"?Array.from({length:15},(_,index)=>16-index):unitFloors;
    if (!floorList.length) return "";
    const floorButtons=floorList.map((n,index)=>{const y=catalog&&p.key==="tower"?(27+index*(62/14)).toFixed(3):"";return `<button type="button" data-floor="${n}" ${y?`style="--floor-y:${y}%"`:""} aria-label="${n} ${lang==="ru"?"этаж":"հարկ"}"><span>${n}</span><i>${lang==="ru"?"этаж":"հարկ"}</i></button>`;}).join("");
    const overlay=facadeFloors(p,floorList);
    const facadeContent=overlay
      ?`<div class="facade-image-stage facade-image-stage--mapped" aria-label="${t("chooseFloor")}"><img src="${a(p.facade)}" alt="${p.name}">${overlay}</div>`
      :(catalog?`<div class="facade-image-stage"><img src="${a(p.facade)}" alt="${p.name}"><div class="floor-rail" aria-label="${t("chooseFloor")}">${floorButtons}</div></div>`:`<img src="${a(p.facade)}" alt="${p.name}"><div class="floor-rail" aria-label="${t("chooseFloor")}">${floorButtons}</div>`);
    return `<div class="floor-stage" data-floor-stage data-project="${p.key}" data-catalog-scheme="${catalog}"><div class="facade-view">${facadeContent}<div class="facade-caption"><span>${p.name}</span><strong>${t("chooseFloor")}</strong></div></div></div>`;
  }

  function floorSelector(p) {
    const stage=floorStage(p);
    if(!stage)return "";
    if(p.key==="tower")return `<section class="floor-section tower-apartment-choice section-pad" id="floor-selector"><div class="page-shell"><div class="tower-apartment-choice__head">${heading(t("floorK"),t("towerChooseT"),t("towerChooseP"))}<a class="button button--accent" href="${link("apartments.html?project=tower")}">${t("towerCatalogButton")}${icon("arrow")}</a></div>${stage}</div></section>`;
    return `<section class="floor-section section-pad" id="floor-selector"><div class="page-shell">${heading(t("floorK"),t("floorT"),t("floorP"))}${stage}</div></section>`;
  }

  function projectApartments(p) {
    const count=D.units.filter(u=>u.project===p.key).length;
    const copy=count?t("projectAptsP"):p.key==="plaza"?t("soldOut"):t("unpublished");
    const title=p.key==="tower"?t("towerApts"):t("projectApts");
    return `<section class="project-apartments section-pad"><div class="page-shell project-apartments__inner"><div>${heading(t("finderK"),title,copy)}</div><div class="project-apartments__action"><a class="button button--dark" href="${count?link(`apartments.html?project=${p.key}`):"#contacts"}">${count?t("catalogOpen"):t("contactT")}${icon("arrow")}</a></div></div></section>`;
  }

  function gallery(p) {
    const items=[...p.gallery.map((image,i)=>({image,label:`${p.name} — ${i+1}`})),...(p.key==="tower"?p.features.map(feature=>({image:feature.image,label:l(feature.title)})):[])];
    return `<div class="content-carousel project-gallery-carousel" data-carousel><div class="carousel-track" data-carousel-track>${items.map((item,i)=>`<button type="button" class="gallery-item" data-gallery-image="${a(item.image)}" aria-label="${lang==="ru"?"Открыть изображение":"Բացել պատկերը"} ${i+1}"><img src="${a(item.image)}" alt="${esc(item.label)}" loading="lazy"></button>`).join("")}</div><div class="carousel-controls"><button type="button" data-carousel-prev aria-label="${t("previous")}">${icon("back")}</button><span><b data-carousel-current>1</b> / ${items.length}</span><button type="button" data-carousel-next aria-label="${t("next")}">${icon("arrow")}</button></div></div>`;
  }

  function finishing(p) {
    const targeted=p.key==="tower"||p.key==="hills";
    const title=targeted?(lang==="ru"?"Внутренняя отделка":"Ներքին հարդարում"):(p.key==="tower"?t("towerFinishT"):t("finishT"));
    const kicker=targeted?p.name:t("finishK");
    return `<section class="finishing-section${targeted?" finishing-section--targeted":""} section-pad"><div class="page-shell"><div class="finishing-intro">${heading(kicker,title,t("finishP"))}</div><div class="finishing-grid"><figure><img src="${a("finish-real.jpg")}" alt="${title}" loading="lazy"><figcaption>${lang==="ru"?"Реальный материал из исходного проекта":"Իրական նյութ աղբյուր նախագծից"}</figcaption></figure><figure><img src="${a("finish-real-alt.jpg")}" alt="${title}" loading="lazy"><figcaption>${lang==="ru"?"Второй реальный ракурс":"Երկրորդ իրական տեսանկյուն"}</figcaption></figure><div class="technical-card"><span>TECH</span><h3>${lang==="ru"?"Инженерные детали":"Ինժեներական մանրամասներ"}</h3><p>${t("technical")}</p></div></div></div></section>`;
  }

  function projectParking(p) {
    const image=p.key==="tower"?"tower-parking-illustration.jpg":p.key==="townhouse"?"parking-1.jpg":p.gallery[1], title=p.key==="tower"?t("towerParkingT"):t("parkingT");
    return `<section class="project-parking section-pad"><div class="page-shell parking-layout"><div class="parking-image"><img src="${a(image)}" alt="${title}" loading="lazy">${p.key==="tower"?`<span class="parking-illustration-label">${t("illustration")}</span>`:""}</div><div class="parking-copy">${heading(t("parkingK"),title,t("parkingP"))}<a class="text-link" href="${link("parking.html")}">${t("parkingPage")}${icon("arrow")}</a></div></div></section>`;
  }

  function progress(p) {
    const towerVisuals=["tw-progress-1.webp","tw-progress-2.webp","tw-progress-3.webp"];
    const hillsVisuals=["hl-progress-1.webp","hl-progress-3.webp","hl-progress-4.webp","hl-progress-5.webp"];
    const visuals=p.key==="tower"?towerVisuals:p.key==="hills"?hillsVisuals:null;
    const cards=visuals?visuals.map(image=>`<article class="progress-card progress-card--date-pending"><div class="progress-media"><button type="button" class="gallery-item" data-gallery-image="${a(image)}" aria-label="${lang==="ru"?"Открыть изображение":"Բацел патkeрə"}"><img src="${a(image)}" alt="${p.name} — ${t("temporaryVisual")}" loading="lazy"></button></div></article>`).join(""):[1,2,3].map(n=>`<article class="progress-card"><div class="progress-placeholder"><span>0${n}</span><i>${t("photoPending")}</i></div><div><time>${t("monthPending")}</time><p>${t("statusPending")}</p></div></article>`).join("");
    return `<section class="progress-section section-pad"><div class="page-shell">${heading(t("progressK"),t("progressT"),visuals?"":t("progressP"))}<div class="progress-grid">${cards}</div></div></section>`;
  }

  function towerInteractiveMap() {
    const label=lang==="ru"?"Интерактивная карта Milon Tower и центра Абовяна":"Milon Tower-ի և Աբովյանի կենտրոնի ինտերակտիվ քարտեզ";
    return `<div class="tower-interactive-map" aria-label="${label}"><div data-milon-map data-lang="${lang}" data-assets="${new URL("components/milon-map/assets/", ROOT).href}"></div></div>`;
  }

  function towerNeighborhoodSection() {
    return `<section class="tower-neighborhood" id="tower-neighborhood"><div class="page-shell tower-neighborhood__heading">${heading(t("mapK"),t("neighborhoodT"),t("towerLocationP"))}</div>${towerInteractiveMap()}</section>`;
  }

  function projectPage(p) {
    const intro=`<section class="project-intro section-pad"><div class="page-shell"><div class="project-intro__copy"><span class="eyebrow">${l(p.eyebrow)}</span><h2>${l(p.title)}</h2><p>${l(p.intro)}</p></div><div class="fact-grid">${p.facts.map(f=>`<div><strong>${f.value}</strong><span>${l(f.label)}</span></div>`).join("")}</div></div></section>`;
    const location=p.key==="tower"?towerNeighborhoodSection():`<section class="project-location section-pad"><div class="page-shell">${heading(t("mapK"),t("mapT"),l(p.location))}${mapBlock(p)}</div></section>`;
    const apartments=p.key==="tower"?"":projectApartments(p);
    const features=p.key==="tower"?"":`<section class="features-section section-pad"><div class="page-shell">${heading(t("benefitK"),t("benefitT"))}<div class="feature-grid">${p.features.map((f,i)=>`<article><div><img src="${a(f.image)}" alt="${l(f.title)}" loading="lazy"></div><span>0${i+1}</span><h3>${l(f.title)}</h3><p>${l(f.text)}</p></article>`).join("")}</div></div></section>`;
    return `${header()}<main id="main">${projectHero(p)}${intro}${location}${floorSelector(p)}${apartments}<section class="gallery-section section-pad"><div class="page-shell">${heading(t("galleryK"),t("galleryT"))}${gallery(p)}</div></section>${features}${finishing(p)}${projectParking(p)}${progress(p)}${contactSection({project:p.name})}</main>${footer()}${dialogs()}`;
  }

  function aboutPage() {
    const principlesHeading=`<div class="about-principles-heading"><span class="eyebrow">${t("companyK")}</span><h2>${t("principlesT")}</h2><p>${t("companyP")}</p></div>`;
    return `${header()}<main id="main"><section class="editorial-hero"><div class="page-shell"><span class="eyebrow">${t("aboutK")}</span><h1>${t("aboutT")}</h1><p>${t("aboutLead")}</p></div><div class="editorial-hero__image"><img src="${a("am-2.jpg")}" alt="Milon Mining"></div></section><section class="principles-section section-pad"><div class="page-shell">${principlesHeading}<div class="principle-grid">${t("principles").map((x,i)=>`<article><span>0${i+1}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join("")}</div></div></section><section class="timeline-section section-pad"><div class="page-shell">${heading(t("aboutK"),t("historyT"))}<div class="timeline">${D.timeline.map(x=>`<article><time>${x.year}</time><p>${x[lang]}</p></article>`).join("")}</div></div></section>${contactSection()}</main>${footer()}${dialogs()}`;
  }

  function parkingPage() {
    const lead=`<div class="section-heading parking-page-heading"><div><span class="eyebrow">${t("parkingK")}</span><h1>${t("parkingT")}</h1></div><p>${t("parkingP")}</p></div>`;
    return `${header()}<main id="main"><section class="parking-types parking-types--page section-pad"><div class="page-shell">${lead}<div class="parking-type-grid">${t("parkingTypes").map((x,i)=>`<article><span>0${i+1}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join("")}</div><div class="parking-spread"><img src="${a("parking-2.jpg")}" alt="${t("parkingT")}" loading="lazy"><blockquote>${t("parkingDetails")}</blockquote></div></div></section>${contactSection()}</main>${footer()}${dialogs()}`;
  }

  function privacyPage() {
    return `${header()}<main id="main"><section class="legal-page section-pad"><div class="page-shell legal-layout"><aside><span class="eyebrow">Legal</span><span class="draft-badge">${t("legalDraft")}</span><a href="mailto:${D.contacts.email}">${D.contacts.email}</a></aside><article><h1>${t("privacyT")}</h1><p class="legal-lead">${t("privacyIntro")}</p>${t("privacySections").map((x,i)=>`<section ${i===2?'id="personal-data"':""}><span>0${i+1}</span><div><h2>${x[0]}</h2><p>${x[1]}</p></div></section>`).join("")}</article></div></section></main>${footer()}`;
  }

  function setMeta() {
    document.documentElement.lang=lang;
    const targetedTheme=(page==="project"&&(projectKey==="tower"||projectKey==="hills"))||page==="about"||page==="parking"||page==="catalog"||page==="offers"||(page==="offer"&&document.body.dataset.offer!=="mortgage-calculator");
    if(targetedTheme)document.querySelector('meta[name="theme-color"]')?.setAttribute("content","#1d283e");
    const offer=D.offers.find(item=>item.id===document.body.dataset.offer);
    const names={home:lang==="ru"?"Milon Mining — жилые проекты в Армении":"Milon Mining — բնակելի նախագծեր Հայաստանում",catalog:lang==="ru"?"Квартиры — Milon Mining":"Բնակարաններ — Milon Mining",about:lang==="ru"?"О компании — Milon Mining":"Մեր մասին — Milon Mining",parking:lang==="ru"?"Паркинг — Milon Mining":"Կայանատեղի — Milon Mining",privacy:t("privacyT")+" — Milon Mining",project:D.projects[projectKey]?.name+" — Milon Mining",offers:`${t("offersT")} — Milon Mining`,offer:offer?`${l(offer.title)} — Milon Mining`:"Milon Mining"};
    const title=names[page]||"Milon Mining", description=offer?l(offer.summary):page==="offers"?t("offersP"):document.querySelector('meta[name="description"]')?.content||"Milon Mining";
    document.title=title;
    const setMetaTag=(selector,attributes)=>{let node=document.head.querySelector(selector);if(!node){node=document.createElement("meta");document.head.append(node);}Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,value));};
    setMetaTag('meta[name="description"]',{name:"description",content:description});
    setMetaTag('meta[property="og:title"]',{property:"og:title",content:title});
    setMetaTag('meta[property="og:description"]',{property:"og:description",content:description});
    if(page==="offers"||page==="offer"){
      const base="https://www.milonmining.am", slug=page==="offers"?"offers/":`offers/${offer?.slug||""}/`, canonical=`${base}/${lang}/${slug}`;
      const setLinkTag=(rel,hreflang,href)=>{const selector=hreflang?`link[rel="${rel}"][hreflang="${hreflang}"]`:`link[rel="${rel}"]:not([hreflang])`;let node=document.head.querySelector(selector);if(!node){node=document.createElement("link");node.rel=rel;if(hreflang)node.hreflang=hreflang;document.head.append(node);}node.href=href;};
      setLinkTag("canonical","",canonical);setLinkTag("alternate","ru",`${base}/ru/${slug}`);setLinkTag("alternate","hy",`${base}/hy/${slug}`);setLinkTag("alternate","x-default",`${base}/ru/${slug}`);
      setMetaTag('meta[property="og:url"]',{property:"og:url",content:canonical});
      setMetaTag('meta[property="og:type"]',{property:"og:type",content:"website"});
      if(offer)setMetaTag('meta[property="og:image"]',{property:"og:image",content:new URL(a(offer.image),base).href});
      setMetaTag('meta[name="robots"]',{name:"robots",content:offer&&!isOfferActive(offer)?"noindex,follow":"index,follow"});
    }
  }

  function render() {
    setMeta();
    app.querySelectorAll?.("[data-milon-map]").forEach(container=>container.__milonMap?.destroy());
    if (page==="home") app.innerHTML=homePage();
    else if (page==="catalog") app.innerHTML=catalogPage();
    else if (page==="project"&&D.projects[projectKey]) app.innerHTML=projectPage(D.projects[projectKey]);
    else if (page==="offers") app.innerHTML=offersIndexPage();
    else if (page==="offer") { const offer=D.offers.find(item=>item.id===document.body.dataset.offer); app.innerHTML=offer?offerPage(offer):offersIndexPage(); }
    else if (page==="about") app.innerHTML=aboutPage();
    else if (page==="parking") app.innerHTML=parkingPage();
    else if (page==="privacy") app.innerHTML=privacyPage();
    else app.innerHTML=homePage();
    bind();
  }

  function bind() {
    const siteHeader=document.querySelector("[data-header]");
    const onScroll=()=>siteHeader?.classList.toggle("is-scrolled",scrollY>24); onScroll(); addEventListener("scroll",onScroll,{passive:true});
    document.querySelector("[data-language]")?.addEventListener("click",()=>{const next=lang==="hy"?"ru":"hy";localStorage.setItem("milon-language",next);if(page==="offers"){location.href=offersHref(next);return;}if(page==="offer"){const offer=D.offers.find(item=>item.id===document.body.dataset.offer);location.href=offer?offerHref(offer,next):offersHref(next);return;}lang=next;const url=new URL(location.href);url.searchParams.set("lang",lang);try{history.replaceState({},"",url);}catch(error){if(location.protocol!=="file:")throw error;}render();scrollTo({top:0});});
    const toggle=document.querySelector("[data-menu-toggle]"), menu=document.querySelector("[data-mobile-menu]");
    toggle?.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")!=="true";toggle.setAttribute("aria-expanded",String(open));menu?.setAttribute("aria-hidden",String(!open));document.body.classList.toggle("menu-open",open);});
    menu?.querySelectorAll("a").forEach(item=>item.addEventListener("click",()=>{toggle?.setAttribute("aria-expanded","false");menu.setAttribute("aria-hidden","true");document.body.classList.remove("menu-open");}));
    document.querySelectorAll("[data-finder]").forEach(bindFinder);
    document.querySelectorAll("[data-clear-filter]").forEach(button=>button.addEventListener("click",()=>{const form=button.closest("form"),name=button.dataset.clearFilter;if(!form||!name)return;form.querySelectorAll(`input[name="${name}"]`).forEach(input=>{input.checked=false;});form.dispatchEvent(new Event("change",{bubbles:true}));}));
    document.querySelector("[data-sort]")?.addEventListener("change",()=>{catalogPageNumber=1;updateCatalog();});
    bindBookingButtons(); document.querySelectorAll("[data-lead-form]").forEach(bindLead);
    document.querySelectorAll("[data-dialog-close]").forEach(b=>b.addEventListener("click",()=>b.closest("dialog")?.close()));
    document.querySelectorAll("dialog").forEach(d=>d.addEventListener("click",e=>{if(e.target===d)d.close();}));
    document.querySelectorAll("[data-map-query]").forEach(b=>b.addEventListener("click",()=>{const box=b.closest("[data-map]");box.querySelectorAll("button").forEach(x=>x.classList.toggle("is-active",x===b));const q=b.dataset.mapQuery;box.querySelector("iframe").src=`https://www.google.com/maps?q=${encodeURIComponent(q)}&t=k&z=17&output=embed`;box.querySelector("[data-map-external]").href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;}));
    document.querySelectorAll("[data-project-map-select]").forEach(button=>button.addEventListener("click",()=>{const root=button.closest("[data-project-map]"),p=D.projects[button.dataset.projectMapSelect];if(!root||!p)return;root.querySelectorAll("[data-project-map-select]").forEach(node=>node.classList.toggle("is-active",node===button));root.querySelector("iframe").src=`https://www.google.com/maps?q=${encodeURIComponent(p.mapQuery)}&z=13&output=embed`;root.querySelector("[data-project-map-card]").innerHTML=projectMapCard(p);}));
    document.querySelectorAll("[data-gallery-image]").forEach(b=>b.addEventListener("click",()=>{const d=document.querySelector("[data-gallery-dialog]"),img=d?.querySelector("[data-gallery-full]");if(!d||!img)return;img.src=b.dataset.galleryImage;img.alt=b.querySelector("img")?.alt||"Milon Mining";d.showModal();}));
    bindFloorButtons();
    bindMortgageButtons();
    bindUnitDetailButtons();
    bindUnitCardMedia();
    bindCatalogPagination();
    document.querySelectorAll("[data-mortgage-calculator]").forEach(bindMortgageCalculator);
    document.querySelectorAll("[data-carousel]").forEach(bindCarousel);
    document.querySelectorAll("[data-milon-map]").forEach(container=>{if(container.__milonMap)container.__milonMap.setLanguage(lang);else if(window.MilonMap)window.MilonMap.create(container,{lang,assetsBase:container.dataset.assets});});
    bindCatalogModes();
    const catalogFinder=document.querySelector('[data-finder][data-mode="catalog"]');
    if(catalogFinder)syncCatalogTowerTools(catalogFinder);
  }

  function bindFinder(form) {
    const update=()=>{const f=readFilters(form),btn=form.querySelector("[data-result-button]");if(btn)btn.innerHTML=`${t("show")}${icon("arrow")}`;const room=form.querySelector("[data-room-summary]");if(room)room.textContent=roomSummary(f);const floor=form.querySelector("[data-floor-summary]");if(floor)floor.textContent=floorSummary(f);if(form.dataset.mode==="catalog"){catalogPageNumber=1;updateCatalog();syncCatalogTowerTools(form);}};
    form.addEventListener("input",update);form.addEventListener("change",update);form.addEventListener("reset",()=>requestAnimationFrame(update));
    form.addEventListener("submit",e=>{e.preventDefault();const f=readFilters(form);if(form.dataset.mode==="catalog"){const u=new URL(location.href);catalogPageNumber=1;u.searchParams.delete("page");["project","areaMin","areaMax","priceMin","priceMax"].forEach(k=>f[k]&&f[k]!=="all"?u.searchParams.set(k,f[k]):u.searchParams.delete(k));f.rooms.length?u.searchParams.set("rooms",f.rooms.join(",")):u.searchParams.delete("rooms");f.floors.length?u.searchParams.set("floors",f.floors.join(",")):u.searchParams.delete("floors");try{history.replaceState({},"",u);}catch(error){if(location.protocol!=="file:")throw error;}updateCatalog();}else{const q=new URLSearchParams({lang});["project","areaMin","areaMax","priceMin","priceMax"].forEach(k=>f[k]&&f[k]!=="all"&&q.set(k,f[k]));if(f.rooms.length)q.set("rooms",f.rooms.join(","));if(f.floors.length)q.set("floors",f.floors.join(","));location.href=`apartments.html?${q}`;}});
  }

  function setCatalogMode(mode="list") {
    const tools=document.querySelector("[data-tower-catalog-tools]"),list=document.querySelector("[data-catalog-list-view]"),scheme=document.querySelector("[data-catalog-scheme-view]");
    if(!tools||!list||!scheme)return;
    const next=mode==="scheme"?"scheme":"list";
    list.hidden=next!=="list";
    scheme.hidden=next!=="scheme";
    tools.querySelectorAll("[data-catalog-view]").forEach(button=>{const active=button.dataset.catalogView===next;button.classList.toggle("is-active",active);button.setAttribute("aria-selected",String(active));button.tabIndex=active?0:-1;});
  }

  function bindCatalogModes() {
    document.querySelectorAll("[data-catalog-view]").forEach(button=>{if(button.dataset.bound)return;button.dataset.bound="1";button.addEventListener("click",()=>setCatalogMode(button.dataset.catalogView));button.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const tabs=[...button.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]')||[]];if(!tabs.length)return;const index=event.key==="Home"?0:event.key==="End"?tabs.length-1:(tabs.indexOf(button)+(event.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;tabs[index].focus();tabs[index].click();});});
  }

  function syncCatalogTowerTools(form) {
    const tools=document.querySelector("[data-tower-catalog-tools]");
    if(!tools)return;
    tools.hidden=false;
  }

  function updateCatalog() {
    const form=document.querySelector('[data-finder][data-mode="catalog"]'),list=document.querySelector("[data-unit-list]");if(!form||!list)return;const sort=document.querySelector("[data-sort]")?.value||"floor-desc",units=sortCatalogUnits(filterUnits(readFilters(form)),sort),pages=Math.max(1,Math.ceil(units.length/CATALOG_PAGE_SIZE));catalogPageNumber=Math.min(pages,Math.max(1,catalogPageNumber));list.innerHTML=catalogCards(units);const count=document.querySelector("[data-catalog-count]");if(count)count.textContent=units.length;const pagination=document.querySelector("[data-catalog-pagination-root]");if(pagination)pagination.innerHTML=catalogPagination(units.length);const url=new URL(location.href);catalogPageNumber>1?url.searchParams.set("page",String(catalogPageNumber)):url.searchParams.delete("page");try{history.replaceState({},"",url);}catch(error){if(location.protocol!=="file:")throw error;}bindBookingButtons();bindMortgageButtons();bindUnitDetailButtons();bindUnitCardMedia();bindCatalogPagination();
  }

  function bindCatalogPagination() {
    document.querySelectorAll("[data-catalog-page]").forEach(button=>{if(button.dataset.bound)return;button.dataset.bound="1";button.addEventListener("click",()=>{catalogPageNumber=Number(button.dataset.catalogPage)||1;updateCatalog();document.querySelector("[data-unit-list]")?.scrollIntoView({behavior:"smooth",block:"start"});});});
  }

  function bindUnitCardMedia(root=document) {
    root.querySelectorAll("[data-unit-card-src]").forEach(button=>{if(button.dataset.mediaBound)return;button.dataset.mediaBound="1";button.addEventListener("click",()=>{const media=button.closest("[data-unit-card-media]"),image=media?.querySelector("[data-unit-card-image]");if(!media||!image)return;image.src=button.dataset.unitCardSrc;image.alt=button.dataset.unitCardAlt||"";media.querySelectorAll("[data-unit-card-src]").forEach(node=>node.classList.toggle("is-active",node===button));});});
  }

  function bindUnitDetailButtons(root=document) {
    root.querySelectorAll("[data-unit-open]").forEach(button=>{if(button.dataset.unitBound)return;button.dataset.unitBound="1";button.addEventListener("click",()=>openUnitDetail(button.dataset.unitOpen));});
    root.querySelectorAll(".unit-card[data-unit]").forEach(card=>{if(card.dataset.cardBound)return;card.dataset.cardBound="1";card.addEventListener("click",event=>{if(event.target.closest("button,a,input,select,summary"))return;openUnitDetail(card.dataset.unit);});});
  }

  function bindFloorButtons(root=document) {
    root.querySelectorAll("[data-floor]").forEach(button=>{if(button.dataset.floorBound)return;button.dataset.floorBound="1";const stage=button.closest("[data-floor-stage]");button.addEventListener("pointerenter",()=>button.classList.add("is-preview"));button.addEventListener("pointerleave",()=>button.classList.remove("is-preview"));button.addEventListener("click",()=>{stage?.querySelectorAll("[data-floor]").forEach(node=>node.classList.toggle("is-selected",node===button));showFloor(stage,Number(button.dataset.floor));});});
  }

  function bindUnitGallery(root) {
    if(!root||root.dataset.bound)return;root.dataset.bound="1";
    const thumbs=[...root.querySelectorAll("[data-unit-gallery-thumb]")], image=root.querySelector("[data-unit-gallery-image]"), label=root.querySelector("[data-unit-gallery-label]");if(!thumbs.length||!image)return;
    const show=index=>{const next=(index+thumbs.length)%thumbs.length,thumb=thumbs[next];root.dataset.galleryIndex=String(next);image.src=thumb.dataset.gallerySrc;image.alt=`${thumb.dataset.galleryLabel} № ${root.closest("[data-unit-dialog]")?.dataset.unitNumber||""}`;if(label)label.textContent=thumb.dataset.galleryLabel;thumbs.forEach((node,i)=>{node.classList.toggle("is-active",i===next);node.setAttribute("aria-selected",String(i===next));});};
    thumbs.forEach((thumb,index)=>thumb.addEventListener("click",()=>show(index)));root.querySelector("[data-unit-gallery-prev]")?.addEventListener("click",()=>show(Number(root.dataset.galleryIndex||0)-1));root.querySelector("[data-unit-gallery-next]")?.addEventListener("click",()=>show(Number(root.dataset.galleryIndex||0)+1));let startX=0;root.addEventListener("touchstart",event=>{startX=event.changedTouches[0]?.clientX||0;},{passive:true});root.addEventListener("touchend",event=>{const delta=(event.changedTouches[0]?.clientX||0)-startX;if(Math.abs(delta)>45)show(Number(root.dataset.galleryIndex||0)+(delta<0?1:-1));},{passive:true});
  }

  function openUnitDetail(id) {
    const unit=D.units.find(item=>item.id===id),dialog=document.querySelector("[data-unit-dialog]"),content=dialog?.querySelector("[data-unit-detail-content]");if(!unit||!dialog||!content)return;dialog.dataset.unitNumber=unitNumber(unit);content.innerHTML=unitDetailContent(unit);bindUnitGallery(content.querySelector("[data-unit-gallery]"));bindBookingButtons();bindMortgageButtons();dialog.showModal();
  }

  function bindBookingButtons() { document.querySelectorAll("[data-book]").forEach(b=>{if(b.dataset.bound)return;b.dataset.bound="1";b.addEventListener("click",()=>openBooking(b.dataset.book));}); }
  function bindMortgageButtons() { document.querySelectorAll("[data-mortgage-open]").forEach(b=>{if(b.dataset.mortgageBound)return;b.dataset.mortgageBound="1";b.addEventListener("click",()=>openMortgage(b.dataset.mortgageOpen));}); }
  function openBooking(id) { const u=D.units.find(x=>x.id===id),d=document.querySelector("[data-booking-dialog]");if(!u||!d)return;document.querySelector("[data-unit-dialog]")?.close();d.querySelector("[data-selected-unit]").innerHTML=`<span>${t("selected")}</span><strong>${D.projects[u.project].name} · № ${unitNumber(u)}</strong><small>${u.rooms} ${lang==="ru"?"комн.":"սեն."} · ${sqm(u.area)} · ${u.floor} ${lang==="ru"?"этаж":"հարկ"} · ${money(u.price)}</small>`;d.querySelector("[data-booking-form]").innerHTML=leadForm({project:D.projects[u.project].name,apartment:u.id});bindLead(d.querySelector("[data-lead-form]"));d.showModal(); }

  function openMortgage(id) {
    const unit=D.units.find(item=>item.id===id), dialog=document.querySelector("[data-mortgage-dialog]"), content=dialog?.querySelector("[data-mortgage-content]");
    if(!dialog||!content)return;
    document.querySelector("[data-unit-dialog]")?.close();
    content.innerHTML=mortgageCalculatorContent(unit||null);
    bindMortgageCalculator(content.querySelector("[data-mortgage-calculator]"));
    dialog.showModal();
  }

  function bindLead(form) {
    if(!form||form.dataset.bound)return;form.dataset.bound="1";form.addEventListener("submit",async e=>{e.preventDefault();if(!form.reportValidity())return;const fd=new FormData(form),status=form.querySelector("[data-form-status]"),button=form.querySelector('button[type="submit"]');const payload={name:String(fd.get("name")||"").trim(),phone:String(fd.get("phone")||"").trim(),preferred_contact_method:fd.get("preferred_contact_method"),project:form.dataset.project||null,apartment_id:form.dataset.apartment||null,source_page:location.pathname.split("/").pop()||"index.html",language:lang,consent:fd.get("consent")==="on",created_at:new Date().toISOString()};dispatchEvent(new CustomEvent("milon:lead",{detail:payload}));const apiBase=(window.MILON_CONFIG?.apiBase||"").replace(/\/+$/,"");const aptId=payload.apartment_id;if(!apiBase||!aptId){status.innerHTML=`${t("pendingBackend")} <a href="tel:${D.contacts.mobile.replace(/\s/g,"")}">${D.contacts.mobile}</a>`;status.className="form-status is-pending";return;}button.disabled=true;status.textContent=t("sending");try{const body={name:payload.name,phone:payload.phone,relation_id:parseInt(aptId,10)};const response=await fetch(`${apiBase}/reserve/apartments`,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(body)});if(!response.ok)throw new Error(String(response.status));status.textContent=t("sent");status.className="form-status is-success";form.reset();}catch(err){console.error(err);status.textContent=t("sendError");status.className="form-status is-error";}finally{button.disabled=false;}});
  }

  function bindMortgageCalculator(form) {
    if(!form||form.dataset.bound)return;
    form.dataset.bound="1";
    const update=()=>{const price=Number(form.elements.price.value),downRaw=Number(form.elements.down.value),years=Number(form.elements.years.value),rate=Number(form.elements.rate.value),downType=form.elements.downType.value,down=downType==="percent"?price*downRaw/100:downRaw,loan=price-down,payment=calculateMortgage(price,down,years,rate),paymentOutput=form.querySelector("[data-mortgage-payment]"),loanOutput=form.querySelector("[data-mortgage-loan]"),error=form.querySelector("[data-mortgage-error]"),valid=Number.isFinite(price)&&price>0&&price<=1e10&&Number.isFinite(downRaw)&&downRaw>=0&&(downType!=="percent"||downRaw<=100)&&down>=0&&down<price&&Number.isFinite(years)&&years>=1&&years<=50&&Number.isFinite(rate)&&rate>=0&&rate<=100;
      if(loanOutput)loanOutput.textContent=valid?money(Math.round(loan)):"—";
      if(paymentOutput)paymentOutput.textContent=valid&&Number.isFinite(payment)&&payment>0?money(Math.round(payment)):"—";
      if(error)error.textContent=price>0?(valid?"":t("mortgageInvalid")):t("mortgageNoPrice");
      form.classList.toggle("has-error",!valid);
    };
    let previousDownType=form.elements.downType.value;
    form.elements.downType.addEventListener("change",()=>{const price=Number(form.elements.price.value),value=Number(form.elements.down.value),nextType=form.elements.downType.value;if(price>0&&Number.isFinite(value)){form.elements.down.value=nextType==="percent"&&previousDownType==="amount"?Math.min(100,Math.round(value/price*1000)/10):nextType==="amount"&&previousDownType==="percent"?Math.round(price*value/100/100000)*100000:value;}form.elements.down.step=nextType==="percent"?"0.1":"100000";previousDownType=nextType;update();});
    form.addEventListener("input",update);form.addEventListener("change",update);
    form.addEventListener("submit",e=>e.preventDefault());
    update();
  }

  function bindCarousel(root) {
    if(!root||root.dataset.bound)return;root.dataset.bound="1";
    const track=root.querySelector("[data-carousel-track]"),prev=root.querySelector("[data-carousel-prev]"),next=root.querySelector("[data-carousel-next]"),current=root.querySelector("[data-carousel-current]");if(!track)return;
    const step=()=>{const item=track.firstElementChild;if(!item)return track.clientWidth;const style=getComputedStyle(track);return item.getBoundingClientRect().width+(parseFloat(style.columnGap||style.gap)||0);};
    const update=()=>{const index=Math.round(track.scrollLeft/Math.max(1,step()))+1,total=track.children.length;if(current)current.textContent=Math.min(total,Math.max(1,index));if(prev)prev.disabled=track.scrollLeft<4;if(next)next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-4;};
    prev?.addEventListener("click",()=>track.scrollBy({left:-step(),behavior:"smooth"}));next?.addEventListener("click",()=>track.scrollBy({left:step(),behavior:"smooth"}));track.addEventListener("scroll",update,{passive:true});addEventListener("resize",update,{passive:true});update();
  }

  function floorCanvas(p,floor,units,floorImage) {
    const img=`<img src="${a(floorImage)}" alt="${esc(`${t("floorPlan")} ${floor}`)}">`;
    const plan=window.MILON_FLOORPLANS&&window.MILON_FLOORPLANS[`${p.key}-${floor}`];
    if(!plan)return img;
    // Обводим все квартиры с чертежа. Та, которой нет в базе, показывается
    // контуром без карточки — иначе на плане осталась бы дыра.
    const drawn=plan.plan||units.map(u=>({u:u.id,p:plan.units[u.id]})).filter(x=>x.p);
    const shapes=drawn.map(item=>{
      const u=item.u?units.find(x=>x.id===item.u):null;
      if(item.u&&!u)return "";
      const label=u?`${unitNumber(u)} · ${sqm(u.area)} · ${u.rooms} ${lang==="ru"?"комн.":"սեն."} · ${money(u.price)}`:(item.n||"");
      // квартира может быть нарисована несколькими кусками — все кликабельны
      return (item.p||[]).map(poly=>{
        const points=poly.map(point=>point.join(",")).join(" ");
        if(!u)return `<polygon class="floor-hotspot" points="${points}"><title>${esc(label)}</title></polygon>`;
        return `<polygon class="floor-hotspot floor-hotspot--${u.status}" points="${points}" data-unit-open="${esc(u.id)}" tabindex="0" role="button" aria-label="${esc(label)}"><title>${esc(label)}</title></polygon>`;
      }).join("");
    }).join("");
    if(!shapes)return img;
    return `<div class="floor-plan-canvas" style="aspect-ratio:${plan.w}/${plan.h}">${img}<svg class="floor-hotspots" viewBox="0 0 ${plan.w} ${plan.h}" preserveAspectRatio="xMidYMid meet">${shapes}</svg></div>`;
  }

  function floorLegend(p,floor,units) {
    const plan=window.MILON_FLOORPLANS&&window.MILON_FLOORPLANS[`${p.key}-${floor}`];
    if(!plan)return "";
    const marked=units.filter(u=>plan.units[u.id]);
    if(!marked.length)return "";
    const rows=["available","reserved","sold"].map(s=>({s,n:marked.filter(u=>u.status===s).length})).filter(x=>x.n);
    return `<ul class="floor-legend">${rows.map(x=>`<li class="floor-legend__item floor-legend__item--${x.s}"><i aria-hidden="true"></i>${t(x.s)}<b>${x.n}</b></li>`).join("")}</ul>`;
  }

  function showFloor(stage,floor) {
    if(!stage)return;
    const p=D.projects[stage.dataset.project],catalog=stage.dataset.catalogScheme==="true",catalogForm=catalog?document.querySelector('[data-finder][data-mode="catalog"]'):null,catalogFilters=catalogForm?{...readFilters(catalogForm),project:p.key}:null,sourceUnits=catalog&&catalogFilters?filterUnits(catalogFilters):D.units,units=sourceUnits.filter(u=>u.project===p.key&&u.floor===floor),floorImage=units.find(unit=>unit.floorImage)?.floorImage,catalogBack=catalog?`<button type="button" class="back-button back-button--catalog" data-catalog-view="list">${icon("back")}${t("catalogBack")}</button>`:"",emptyAction=catalog?`<button class="text-link" type="button" data-catalog-view="list">${t("catalogBack")}${icon("arrow")}</button>`:`<a class="text-link" href="${link(`apartments.html?project=${p.key}`)}">${t("catalogOpen")}${icon("arrow")}</a>`,emptyState=units.length?"":`<div class="floor-no-units"><p>${t("floorNoUnits")}</p>${emptyAction}</div>`;
    stage.innerHTML=`<div class="floor-plan-view"><div class="floor-plan-nav"><button type="button" class="back-button" data-floor-back>${icon("back")}${t("back")}</button>${catalogBack}</div><div class="floor-plan-copy"><span>${floor} ${lang==="ru"?"этаж":"հարկ"}</span><h3>${p.name} · ${t("floorPlan")}</h3><p>${t("planNote")}</p></div>${floorImage?`<div class="floor-plan-visual">${floorCanvas(p,floor,units,floorImage)}<span>${floor} ${lang==="ru"?"этаж":"հարկ"} · ${units.length} ${t("apt")}</span></div>${floorLegend(p,floor,units)}`:emptyState}<div class="floor-unit-list unit-list">${units.map(unitRow).join("")}</div></div>`;
    stage.querySelector("[data-floor-back]").addEventListener("click",()=>{const fresh=document.createElement("div");fresh.innerHTML=floorStage(p,{catalog});const newStage=fresh.querySelector("[data-floor-stage]");stage.replaceWith(newStage);bindFloorButtons(newStage);});
    bindCatalogModes();bindBookingButtons();bindMortgageButtons();bindUnitDetailButtons();bindUnitCardMedia();
  }

  Object.defineProperty(window,"MILON_TEST_API",{value:Object.freeze({filterUnits,filters,calculateMortgage}),enumerable:false});
  render();
})();
