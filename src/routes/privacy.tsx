import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Политика за приватност — TradingLab.mk" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <Link className="brand" to="/">
            TRADING<span>LAB.MK</span>
          </Link>
          <div className="nav-actions">
            <Link className="nav-cta" to="/">
              Назад кон почетна
            </Link>
          </div>
        </div>
      </nav>

      <section id="privacy" className="privacy">
        <div className="wrap">
          <div className="privacy-card">
            <span className="section-kicker">Правна напомена</span>
            <h2 className="section-title">Политика за приватност</h2>
            <p className="section-copy">
              TradingLab.mk ја почитува вашата приватност и внимателно постапува со личните податоци
              што ги внесувате преку апликациската форма.
            </p>

            <div className="privacy-body">
              <h3>Кои податоци ги собираме?</h3>
              <p>
                Можеме да ги собереме вашето име и презиме, е-пошта, возраст, искуство во тргувањето
                и одговорите што доброволно ги внесувате во формата.
              </p>

              <h3>За што ги користиме?</h3>
              <p>Податоците ги користиме исклучиво за:</p>
              <ul>
                <li>разгледување на вашата апликација;</li>
                <li>комуникација со вас;</li>
                <li>подобро организирање на програмата и групите.</li>
              </ul>
              <p>
                Вашите податоци нема да ги продаваме или користиме за цели што не се поврзани со
                TradingLab.mk.
              </p>

              <h3>Чување и пристап</h3>
              <p>
                Податоците ќе се чуваат на заштитени алатки до кои пристап имаат само овластени лица
                од TradingLab.mk. Ќе ги чуваме само онолку долго колку што е потребно за обработка
                на апликацијата и комуникација со вас.
              </p>

              <h3>Ваши права</h3>
              <p>
                Во секое време можете да побарате пристап, исправка или бришење на вашите лични
                податоци преку нашата контакт е-пошта.
              </p>

              <h3>Согласност</h3>
              <p>
                Со испраќање на формата потврдувате дека сте ја прочитале оваа Политика за
                приватност и се согласувате вашите податоци да бидат обработени за наведените цели.
              </p>

              <p className="privacy-date">Последно ажурирање: септември 2026 година</p>
            </div>
          </div>
        </div>
      </section>

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
