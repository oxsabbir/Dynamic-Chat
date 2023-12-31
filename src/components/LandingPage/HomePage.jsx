import classes from "./HomePage.module.css";
import BrandLogo from "../UI/BrandLogo";
import HowItWorks from "./HowItWorks";
import Button from "../UI/Button/Button";
import { Link } from "react-router-dom";
import inbox from "./screenshot/inbox.png";
import { icons } from "../UI/Icons";
import { useRef, useState } from "react";
import useObserver from "./useObserver";
import Features from "./Features";
import { useEffect } from "react";
import Footer from "./Footer";
import { navData } from "./constant";
import { contextData } from "../auth/Context";

const HomePage = function () {
  const [menuShow, setMenuShow] = useState(false);
  const { isLoggedIn } = contextData();
  const [isSticky, setIsSticky] = useState(false);
  const homeRef = useRef();
  const navRef = useRef();
  const workRef = useRef();
  const featureRef = useRef();

  const scrollToView = function (event) {
    const id = event.target.id;
    switch (id) {
      case "home":
        {
          homeRef.current.scrollIntoView({ behavior: "smooth" });
          setMenuShow(false);
        }
        break;
      case "works":
        {
          workRef.current.scrollIntoView({ behavior: "smooth" });
          setMenuShow(false);
        }
        break;
      case "feature":
        {
          featureRef.current.scrollIntoView({ behavior: "smooth" });
          setMenuShow(false);
        }
        break;
      default: {
        return;
      }
    }
  };

  const toggleMenu = function () {
    setMenuShow((prev) => !prev);
  };
  useEffect(() => {
    featureRef.current.style.scrollMargin = `${navRef.current.clientHeight}px`;
    workRef.current.style.scrollMargin = `${navRef.current.clientHeight - 1}px`;
    const observerFuntion = function (entries, observer) {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 0 && !entry.isIntersecting) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      });
    };
    const option = {
      root: null,
      rootMargin: `-${navRef.current.clientHeight}px`,
      threshold: [0],
    };
    useObserver(observerFuntion, option, homeRef.current);
  }, []);

  return (
    <>
      <div className={classes.content}>
        <section id="home" className={classes.homePage} ref={homeRef}>
          <nav ref={navRef} className={`${isSticky && classes.stickyNav}`}>
            <BrandLogo />
            <span onClick={toggleMenu}>{icons.menu}</span>
            <ul
              className={`${classes.menuList} ${menuShow && classes.showNav} ${
                isSticky && classes.color
              }`}
            >
              {isLoggedIn && (
                <li>
                  <Link to={"dashboard"}>
                    <Button>Dashboard</Button>
                  </Link>
                </li>
              )}
              {!isLoggedIn && (
                <>
                  {navData.map((item) => (
                    <li key={item.id}>
                      <span id={item.id} onClick={scrollToView}>
                        {item.name}
                      </span>
                    </li>
                  ))}
                  <li>
                    <Link to={"sign-up"}>
                      <Button>OPEN ACCOUNT</Button>
                    </Link>
                  </li>
                  <span onClick={toggleMenu}>{icons.back}</span>
                </>
              )}
            </ul>
          </nav>

          <div className={classes.hero}>
            <div className={classes.heroLeft}>
              <img src={inbox} alt="desktop" />
            </div>
            <div className={classes.heroRight}>
              <h2>
                Make Friends And Share Your thoughts <br /> with Community
              </h2>

              <p>
                We make communication more stable and reliable by new FCA4
                stabilizer And we make application for used like their own just
                use it and get benifited from it. make the world a better place
                giving something like this by yourself <br />
                So what are you waiting for?
              </p>
              <Button
                onClick={() => {
                  window.open(
                    "https://drive.google.com/file/d/141czM1NlGbspSAq0Wz_pG4pzhM88A91W/view?usp=drive_link"
                  );
                }}
              >
                Download now
              </Button>
            </div>
          </div>
        </section>
        <HowItWorks ref={workRef} />
        <Features ref={featureRef} />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
