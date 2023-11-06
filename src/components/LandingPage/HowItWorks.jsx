import classes from "./HowItWorks.module.css";
import desktop from "./screenshot/Dekstop.png";
import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button/Button";
import { forwardRef } from "react";
import useObserver from "./useObserver";
import { howItWorkContent } from "./constant";

const HowItWorks = forwardRef(function HowItWork(_, ref) {
  const sectionRef = useRef();
  const [isTransit, setIsTransit] = useState(false);
  useEffect(() => {
    const observerFuntion = function (entries, observer) {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.6 && entry.isIntersecting === true) {
          setIsTransit(true);
        }
      });
    };
    const option = {
      root: null,
      threshold: [0.6],
    };
    useObserver(observerFuntion, option, sectionRef.current);
  }, []);

  return (
    <>
      <section ref={ref} id="works" className={classes.works}>
        <h2>HOW IT WORK'S</h2>
        <div ref={sectionRef} className={classes.workSection}>
          <div className={`${classes.workLeft} ${isTransit && classes.show}`}>
            <img loading="lazy" src={desktop} alt="inbox-image" />
          </div>

          <div className={`${classes.workRight} ${isTransit && classes.show}`}>
            {howItWorkContent.map((item, i) => (
              <div key={item.id} className={`${classes.workCard}`}>
                <span>{i + 1}</span>
                <div className={classes.cardContent}>
                  <h3>{item.title}</h3>
                  <p>{item.details}</p>
                </div>
              </div>
            ))}
            <Button>Learn more</Button>
          </div>
        </div>
      </section>
    </>
  );
});

export default HowItWorks;
