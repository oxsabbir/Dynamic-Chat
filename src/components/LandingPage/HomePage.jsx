import classes from "./HomePage.module.css";
import BrandLogo from "../UI/BrandLogo";
import HowItWorks from "./HowItWorks";
import Button from "../UI/Button";
import { Link } from "react-router-dom";
import Desktop from "./screenshot/Dekstop.png";
import laptop from "./screenshot/laptopLight.png";
import inbox from "./screenshot/inbox.png";
import { icons } from "../UI/Icons";
import { useRef, useState } from "react";
import useObserver from "./useObserver";
import Features from "./Features";
import { useEffect } from "react";
import Footer from "./Footer";

const HomePage = function () {
  const [menuShow, setMenuShow] = useState(false);
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
              <li>
                <span id="home" onClick={scrollToView}>
                  HOME
                </span>
              </li>
              <li>
                <span id="feature" onClick={scrollToView}>
                  FEATURE
                </span>
              </li>
              <li>
                <span id="works" onClick={scrollToView}>
                  HOW IT WORK'S
                </span>
              </li>
              <li>
                <Link to={"sign-up"}>
                  <Button>OPEN ACCOUNT</Button>
                </Link>
              </li>
              <span onClick={toggleMenu}>{icons.back}</span>
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus id possimus praesentium, perspiciatis provident et
                officia dolorem alias expedita incidunt fuga aliquam quo sequi
                dignissimos beatae quam mollitia. Reiciendis, nesciunt?
              </p>
              <Button>See More</Button>
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
