import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApplicationForm } from "@/components/apply/ApplicationForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TradingLab.mk — Животот е циклус" },
      {
        name: "description",
        content:
          "TradingLab.mk — целосен систем за разбирање на финансиските пазари преку фундаментална и техничка анализа, управување со ризикот и психологија.",
      },
      { property: "og:title", content: "TradingLab.mk — Животот е циклус" },
      {
        property: "og:description",
        content:
          "Научи да ја гледаш логиката зад цената: циклуси, позиционирање, вредност и тајминг во еден систем.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const tickerItems = [
  { s: "BTC", n: "Bitcoin", p: "$111,240", c: "▲ +2.40%", up: true },
  { s: "XAU", n: "Gold", p: "$3,640", c: "▲ +0.80%", up: true },
  { s: "DXY", n: "Dollar Index", p: "97.42", c: "▼ -0.30%", up: false },
  { s: "WTI", n: "Crude Oil", p: "$64.20", c: "▲ +1.10%", up: true },
  { s: "KC", n: "Coffee", p: "$3.82", c: "▼ -0.55%", up: false },
];

const calls = [
  { a: "НАФТА · Енергетски пазар", p: "+200%" },
  { a: "БИТКОИН · Криптовалути", p: "+80%" },
  { a: "ЕТЕРИУМ · Криптовалути", p: "+70%" },
  { a: "ЗЛАТО · Метали", p: "+30%" },
  { a: "КАФЕ · Земјоделски суровини", p: "+30%" },
  { a: "ТЕСЛА · Акции", p: "+40%" },
  { a: "АМЕРИКАНСКИ ДОЛАР · Валути", p: "+6%" },
];

function TickerGroup({ hidden }: { hidden?: boolean }) {
  return (
    <div className="ticker-group" aria-hidden={hidden || undefined}>
      {tickerItems.map((t) => (
        <div className="ticker-item" key={t.s + String(hidden)}>
          <span className="ticker-symbol">{t.s}</span>
          <span className="ticker-name">{t.n}</span>
          <span className="ticker-price">{t.p}</span>
          <span className={`ticker-change ${t.up ? "up" : "down"}`}>{t.c}</span>
        </div>
      ))}
    </div>
  );
}

function Landing() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Не можевме да ја креираме сесијата");
      }
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Настана грешка");
      setCheckoutLoading(null);
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <nav className={`nav${menu ? " nav-open" : ""}`}>
        <div className="wrap nav-in">
          <a className="brand" href="#top">
            TRADING<span>LAB.MK</span>
          </a>
          <div className="links" onClick={() => setMenu(false)}>
            <a href="#logic">Логика</a>
            <a href="#system">Систем</a>
            <a href="#foundation">Темели</a>
            <a href="#audience">За кого</a>
            <a href="#about">За мене</a>
            <a href="#calls">Анализи</a>
            <Link to="/privacy">Приватност</Link>
          </div>
          <div className="nav-actions">
            <a className="nav-cta" href="#audience">
              Истражи го системот ↗
            </a>
            <button className="nav-join" type="button" onClick={() => setOpen(true)}>
              Придружи се
            </button>
            <button
              className="nav-burger"
              type="button"
              aria-label="Мени"
              aria-expanded={menu}
              onClick={() => setMenu((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className="market-ticker" aria-label="Market ticker">
        <div className="market-ticker-head">
          <span className="ticker-dot" /> Market Pulse
        </div>
        <div className="market-ticker-window">
          <div className="market-ticker-track">
            <TickerGroup />
            <TickerGroup hidden />
          </div>
        </div>
      </div>

      <header className="hero" id="top">
        <div className="orb one" />
        <div className="orb two" />
        <div className="wrap">
          <div className="eyebrow">TradingLab.mk Philosophy</div>
          <h1>Животот е циклус.</h1>
          <div className="sub">
            Зад секој циклус постои логика. Наместо да ја бркаме последицата, ја бараме причината
            што ја создава.
          </div>
          <div className="hero-actions">
            <a className="btn primary" href="#logic">
              Види ја логиката ↓
            </a>
            <a className="btn secondary" href="#foundation">
              Нашите темели
            </a>
          </div>
        </div>
      </header>

      <section id="logic">
        <div className="wrap">
          <div className="section-kicker">Истата логика важи и за маркетот!</div>
          <h2 className="section-title">
            МАРКЕТОТ се движи во <span className="blue-title">циклуси.</span>
          </h2>
          <p className="section-copy">
            Ние не се обидуваме да го погодиме секое движење на цената. Го препознаваме циклусот
            преку целосен, темелен систем што ги поврзува причината, вредноста, позиционирањето и
            точниот момент за одлука.
          </p>
          <div className="duo">
            <div className="quote-card">
              <strong>Не прашуваме само „каде ќе оди цената?“</strong>
              <p>
                Прашањето е: <b>зошто</b> би се движела, <b>кој</b> е позициониран,{" "}
                <b>колкава е вредноста</b> и <b>дали сме во точно време за позиција</b>.
              </p>
            </div>
            <div className="cycle-visual">
              <div className="ring r1" />
              <div className="ring r2" />
              <div className="ring r3" />
              <div className="cycle-core">LOGIC</div>
              <div className="cycle-label a">VALUE</div>
              <div className="cycle-label b">POSITIONING</div>
              <div className="cycle-label c">TIMING</div>
            </div>
          </div>
        </div>
      </section>

      <section className="contrast" id="system">
        <div className="wrap">
          <div className="section-kicker">Контра масата</div>
          <h2 className="section-title">
            Кога сите купуваат, ние бараме причина{" "}
            <span style={{ color: "#7fa2ff" }}>зошто да продаваме.</span>
          </h2>
          <p className="section-copy">
            Кога сите продаваат, ние бараме причина зошто да купуваме. Не затоа што сакаме секогаш
            да бидеме контра, туку затоа што екстремите во толпата често создаваат асиметрична
            можност.
          </p>
          <div className="counter-flow">
            <div className="flow-card">
              <div className="label">Crowd extreme</div>
              <div className="big">МАСАТА КУПУВА</div>
              <p>
                Кога премногу учесници се позиционирани во иста насока, оптимизмот може веќе да биде
                вграден во цената. Екстремната еуфорија ја користиме како предупредување за можен
                пресврт, не како самостоен сигнал за продажба.
              </p>
            </div>
            <div className="flow-card">
              <div className="label">Crowd extreme</div>
              <div className="big">МАСАТА ПРОДАВА</div>
              <p>
                Кога стравот и продажниот притисок достигнуваат екстрем, негативниот наратив може
                веќе да биде вграден во цената. Тоа создава услови за можен пресврт, но само со
                потврда од структурата, вредноста и позиционирањето.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-kicker">Како го препознаваме циклусот</div>
          <h2 className="section-title">
            Четири прашања. Една <span className="blue-title">логика.</span>
          </h2>
          <div className="tools">
            <div className="tool">
              <div className="tag">COT REPORT</div>
              <h3>Како се позиционирани големите учесници?</h3>
              <p>
                COT Report ни покажува како се позиционирани различните групи учесници на пазарот.
                Преку него гледаме кој купува, кој продава и дали позиционирањето достигнува екстрем
                што може да најави промена на циклусот.
              </p>
            </div>
            <div className="tool">
              <div className="tag">SEASONALITY</div>
              <h3>Во кој циклус сме?</h3>
              <p>
                Seasonality ни помага да го дефинираме повторливиот временски циклус и историскиот
                ритам на движење на цената.
              </p>
            </div>
            <div className="tool">
              <div className="tag">VALUATION</div>
              <h3>Колкава е вредноста?</h3>
              <p>
                Valuation ни кажува дали инструментот е релативно скап, евтин или неутрален во однос
                на неговиот поширок контекст.
              </p>
            </div>
          </div>

          <div className="timeprice">
            <div className="tp-box">
              <div className="section-kicker">Technical execution</div>
              <div className="tp-title">
                Market =<br />
                Time &amp; Price.
              </div>
              <p className="section-copy">
                Техничкиот дел ни ги дефинира{" "}
                <b>влезот, излезот, локацијата (скапо или евтино) и тајмингот на маркетот</b>, каде
                идејата има смисла и каде престанува да важи.
              </p>
            </div>
            <div className="axis" aria-label="Визуелен приказ на време и цена">
              <span className="axlab price">Price</span>
              <span className="axlab time">Time</span>
              <svg
                className="axis-chart"
                viewBox="0 0 500 250"
                role="img"
                aria-label="Движење на цената"
              >
                <defs>
                  <linearGradient id="priceFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1457ff" stopOpacity=".18" />
                    <stop offset="1" stopColor="#1457ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[35, 70, 105, 140, 175].map((y) => (
                  <line key={y} className="axis-grid" x1="45" y1={y} x2="480" y2={y} />
                ))}
                <line className="axis-line" x1="45" y1="18" x2="45" y2="210" />
                <line className="axis-line" x1="45" y1="210" x2="485" y2="210" />
                {["0", "1", "2", "3", "4", "5"].map((t, i) => (
                  <text key={t} className="tick-label" x="29" y={213 - i * 35}>
                    {t}
                  </text>
                ))}
                <path
                  className="price-area"
                  d="M45 190 L95 170 L135 180 L185 130 L230 145 L280 92 L325 110 L375 58 L420 72 L470 35 L470 210 L45 210 Z"
                />
                <path
                  className="price-path"
                  d="M45 190 L95 170 L135 180 L185 130 L230 145 L280 92 L325 110 L375 58 L420 72 L470 35"
                />
                <circle className="point" cx="135" cy="180" r="7" />
                <text className="entry-label" x="113" y="158">
                  ENTRY
                </text>
                <circle className="point" cx="420" cy="72" r="7" />
                <text className="exit-label" x="395" y="49">
                  EXIT
                </text>
                <text className="zone-label" x="58" y="202">
                  ЕВТИНО
                </text>
                <text className="zone-label" x="392" y="24">
                  СКАПО
                </text>
                <text className="day-label" x="54" y="232">
                  ПОНЕДЕЛНИК
                </text>
                <text className="day-label" x="169" y="232">
                  ВТОРНИК
                </text>
                <text className="day-label" x="277" y="232">
                  СРЕДА
                </text>
                <text className="day-label" x="383" y="232">
                  ЧЕТВРТОК
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section id="foundation">
        <div className="wrap">
          <div className="section-kicker">Темели на нашиот систем</div>
          <h2 className="section-title">
            Системот мора да стои на <span className="blue-title">цврсти темели.</span>
          </h2>
          <p className="section-copy">
            Ниту еден индикатор, можност за влез или анализа не е доволна сама по себе. Одлуката
            станува квалитетна само кога четирите слоеви работат заедно.
          </p>
          <div className="pyramid-wrap">
            <div className="pyramid" aria-label="TradingLab pyramid">
              <div className="layer l1">Fundamental</div>
              <div className="layer l2">Technical</div>
              <div className="layer l3">Risk Management</div>
              <div className="layer l4">Psychology Management</div>
            </div>
            <div className="foundation-list">
              <div className="f-row">
                <b>01</b>
                <div>
                  <strong>Fundamental</strong>
                  <p>
                    Ни помага да разбереме зошто пазарот се движи и во која насока може да продолжи.
                  </p>
                </div>
              </div>
              <div className="f-row">
                <b>02</b>
                <div>
                  <strong>Technical</strong>
                  <p>
                    Ни покажува каде и кога да влеземе во позиција, каде да излеземе и кога нашата
                    идеја повеќе не важи.
                  </p>
                </div>
              </div>
              <div className="f-row">
                <b>03</b>
                <div>
                  <strong>Risk Management</strong>
                  <p>
                    Го заштитува нашиот капитал и не дозволува една погрешна одлука да го загрози
                    целиот систем.
                  </p>
                </div>
              </div>
              <div className="f-row">
                <b>04</b>
                <div>
                  <strong>Psychology Management</strong>
                  <p>
                    Ни помага да ги контролираме емоциите и да носиме одлуки според нашиот систем, а
                    не поради страв, алчност или импулс.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="audience">
        <div className="wrap">
          <div className="section-kicker">За кого е наменета стратегијата</div>
          <h2 className="section-title">
            Од целосен почетник до <span className="blue-title">самостојно оперирање.</span>
          </h2>
          <p className="section-copy">
            Целта не е да зависиш од туѓи сигнали. Целта е постепено да научиш како самостојно да ја
            читаш причината, контекстот, структурата и ризикот зад една одлука.
          </p>
          <div className="audience">
            <div className="aud-card">
              <div className="n">01 / ПОЧЕТНИК</div>
              <h3>За оној што почнува од нула.</h3>
              <p>
                Чекор по чекор гради јасна основа за разбирање на пазарот, без мешање на голем број
                стратегии, индикатори и непотребни информации.
              </p>
            </div>
            <div className="aud-card">
              <div className="n">02 / САМОСТОЕН ТРЕЈДЕР</div>
              <h3>За оној што сака да стане самостоен.</h3>
              <p>
                Учи како од една идеја да изгради целосен план: анализа, влез, управување со
                ризикот, водење на позицијата и преглед на донесената одлука.
              </p>
            </div>
            <div className="aud-card">
              <div className="n">03 / ОГРАНИЧЕНО ВРЕМЕ</div>
              <h3>Најмногу за оние што немаат 8 часа дневно пред компјутер.</h3>
              <p>
                Практичен систем за луѓе со работа, семејство и други обврски, каде квалитетот на
                одлуките е поважен од бројот на отворени позиции.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="wrap">
          <div className="section-kicker">Mentor</div>
          <h2 className="section-title">
            Искуство претворено во <span className="blue-title">систем.</span>
          </h2>
          <div className="bio">
            <div className="bio-card">
              <img
                className="bio-photo-full"
                src="/images/mentor-portrait.jpg"
                alt="Димитар Аврамоски, основач на TradingLab.mk"
                loading="lazy"
              />
              <div className="bio-band">
                <span className="bio-band-name">Димитар Аврамоски</span>
                <span className="bio-band-mini">Основач / TradingLab.mk</span>
              </div>
            </div>
            <div className="bio-copy">
              <p>
                Со тргување се занимавам повеќе од <b>4,5 години</b>, а последните{" "}
                <b>2,5 години професионално и со целосна посветеност</b>. Анализирам и тргувам
                валути, индекси, суровини, акции и криптовалути.
              </p>
              <p>
                Мојот пристап не се темели на еден индикатор или на предвидување на секое движење.
                Градам целосна слика преку фундаментална и техничка анализа, вредност,
                позиционирање, пазарни циклуси, управување со ризикот и психологија.
              </p>
              <p>
                TradingLab.mk го создадов со јасна цел: да изградиме место каде што луѓето нема само
                да следат туѓи сигнали, туку ќе научат{" "}
                <b>
                  самостојно да размислуваат, да носат одлуки и да разберат зошто се движат
                  финансиските пазари.
                </b>
              </p>
              <div className="bio-stat">
                <span className="pill">4,5 години искуство</span>
                <span className="pill">2,5 години професионално</span>
                <span className="pill">Повеќе пазари</span>
                <span className="pill">Систем пред претпоставка</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="calls" id="calls">
        <div className="wrap">
          <div className="section-kicker">Анализи низ различни пазари · 2025–2026</div>
          <h2 className="section-title">
            Различни пазари. Еден <span style={{ color: "#7fa2ff" }}>систем.</span>
          </h2>
          <p className="section-copy">
            Не зависиме од еден пазар или една можност. Истиот систем го применуваме на валути,
            суровини, индекси, акции и криптовалути, секогаш со јасна анализа, контекст и управување
            со ризикот.
          </p>
          <div className="ticker">
            {calls.map((c) => (
              <div className="call" key={c.a}>
                <div className="asset">{c.a}</div>
                <div className="pct">{c.p}</div>
                <small>Движење по објавената анализа · 2025–2026</small>
              </div>
            ))}
            <div className="call">
              <div className="asset">ЕДЕН СИСТЕМ</div>
              <div className="pct">EDGE</div>
              <small>
                Фундаментална анализа → Техничка анализа → Управување со ризикот → Психологија
              </small>
            </div>
          </div>
          <p className="disclaimer">
            Ние не нудиме индивидуални финансиски или инвестициски совети. Сите анализи, примери и
            информации се наменети исклучиво за едукативни цели. Не гарантираме добивка ниту заштита
            од загуба. Секој самостојно ги носи своите одлуки и е одговорен за сопствениот ризик.
          </p>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="wrap">
          <div className="pricing-label">Group Coaching</div>
          <h2 className="section-title">Изберете план</h2>
          <div className="plans">
            <article className="plan">
              <h3>Group Coaching — месечно</h3>
              <p className="plan-intro">
                Континуирана поддршка и едукација во мала група, со автоматско месечно обновување.
              </p>
              <div className="plan-price">
                €67 <small>/ месечно</small>
              </div>
              <div className="plan-note">€67 месечно</div>
              <ul>
                <li>Пристап до неделни сесии</li>
                <li>Снимка од секој одржан час</li>
                <li>Пристап до сите претходно снимени лекции</li>
                <li>Пристап до сите TradingLab индикатори</li>
                <li>Практична анализа на реални пазарни ситуации</li>
                <li>Неделна анализа и подготовка за пазарот</li>
                <li>Насоки за изработка на сопствен план за тргување</li>
                <li>Поддршка во текот на целиот процес на учење</li>
                <li>Пристап до затворената едукативна заедница</li>
                <li>Пристап до позициите на менторот</li>
              </ul>
              <button
                className="plan-button"
                type="button"
                disabled={checkoutLoading === "group_monthly"}
                onClick={() => handleCheckout("group_monthly")}
              >
                {checkoutLoading === "group_monthly" ? "Се пренасочува..." : "Избери план"}
              </button>
            </article>
            <article className="plan featured">
              <div className="popular">НАЈПОПУЛАРНО</div>
              <h3>Group Coaching — 3 месеци</h3>
              <p className="plan-intro">
                Истата програма по поповолна цена, со автоматско обновување на следните 3 месеци.
              </p>
              <div className="plan-price">
                €150 <small>/ за 3 месеци</small>
              </div>
              <div className="plan-note">€150 на секои 3 месеци</div>
              <ul>
                <li>Сè од месечниот план</li>
                <li>Заклучена цена за 3 месеци</li>
                <li>Заштеда од €51 споредено со месечниот план</li>
                <li>Автоматско обновување на следните 3 месеци</li>
              </ul>
              <button
                className="plan-button"
                type="button"
                disabled={checkoutLoading === "group_3m"}
                onClick={() => handleCheckout("group_3m")}
              >
                {checkoutLoading === "group_3m" ? "Се пренасочува..." : "Избери план"}
              </button>
            </article>
            <article className="plan">
              <h3>Group Coaching — 6 месеци</h3>
              <p className="plan-intro">
                Најголема заштеда со еднократна уплата за 6 месеци пристап, без автоматско
                обновување.
              </p>
              <div className="plan-price">
                €300 <small>/ еднократно</small>
              </div>
              <div className="plan-note">€300 еднократно · 6 месеци</div>
              <ul>
                <li>Сè од месечниот план</li>
                <li>Заклучена цена за 6 месеци</li>
                <li>Заштеда од €102 споредено со месечниот план</li>
              </ul>
              <button
                className="plan-button"
                type="button"
                disabled={checkoutLoading === "group_6m"}
                onClick={() => handleCheckout("group_6m")}
              >
                {checkoutLoading === "group_6m" ? "Се пренасочува..." : "Избери план"}
              </button>
            </article>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap">
          <div className="section-kicker">TradingLab.mk</div>
          <h2>
            Научи да ја гледаш <span className="blue-title">логиката зад цената.</span>
          </h2>
          <p>
            Не бараме магичен индикатор. Градиме темели, процес и начин на размислување што можеш да
            го користиш на секој market.
          </p>
          <button className="btn primary" type="button" onClick={() => setOpen(true)}>
            Придружи се
          </button>
        </div>
      </section>

      <div
        className={`form-modal${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="form-dialog">
          <button
            className="form-close"
            type="button"
            aria-label="Затвори ја формата"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <h2>Апликација за TradingLab.mk</h2>
          <p className="form-intro">Одговори на кратките прашања за подобро да те запознаеме.</p>
          {open && <ApplicationForm onSuccess={() => setOpen(false)} />}
        </div>
      </div>

      <footer>
        <div className="wrap foot">
          <div>
            <b>TRADINGLAB.MK</b> · Едукацијата е на прво место.
          </div>
          <div className="foot-links">
            <Link to="/privacy">Политика за приватност</Link>
            <span>·</span>
            <span>Само за едукативни цели</span>
          </div>
        </div>
      </footer>
    </>
  );
}
