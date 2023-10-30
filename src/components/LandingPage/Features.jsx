import classes from "./Features.module.css";
import inbox from "./screenshot/inbox.png";
import darkInbox from "./screenshot/darkInbox.png";
import { icons } from "../UI/Icons";
import lightChat from "./screenshot/lightChat.png";
import { featureContent } from "./constant";
import useObserver from "./useObserver";
import { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";

const Features = forwardRef(function Feature(_, ref) {
  const [isTransit, setIsTransit] = useState(false);
  const sectionRef = useRef();
  useEffect(() => {
    const observerFunc = function (entry, observer) {
      entry.forEach((entries) => {
        if (entries.intersectionRatio >= 0.65 && entries.isIntersecting) {
          setIsTransit(true);
        }
        if (entries.isIntersecting === false) {
          setIsTransit(false);
        }
      });
    };
    const option = { root: null, threshold: 0.65 };
    useObserver(observerFunc, option, sectionRef.current);
  }, []);

  return (
    <>
      <div className={classes.footerBg}>
        <section ref={ref} id="feature" className={classes.feature}>
          <h2>FEATURE</h2>
          <div className={classes.featureContent}>
            <div ref={sectionRef} className={classes.featureDemo}>
              <div className={classes.animateImage}>
                <img
                  className={`${isTransit ? classes.showDemoRight : ""}`}
                  loading="lazy"
                  src={darkInbox}
                  alt="inbox"
                />
                <img loading="lazy" src={inbox} alt="inboxLight" />
                <img
                  className={`${isTransit ? classes.showDemo : ""}`}
                  loading="lazy"
                  src={lightChat}
                  alt="chatLight"
                />
              </div>
            </div>
            <div className={classes.featureList}>
              <div className={classes.featureGrid}>
                {featureContent.map((content) => (
                  <div
                    key={content.id}
                    className={`${classes.featureItem} ${
                      content?.upcoming ? classes.upComing : ""
                    }`}
                  >
                    <span>{icons[content.icon]}</span>
                    <h4>{content.title}</h4>
                    <p>{content.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

export default Features;
