import Button from "../UI/Button/Button";
import classes from "./Footer.module.css";
import { icons } from "../UI/Icons";
import { Link } from "react-router-dom";
import { socialLinks } from "./constant";
const Footer = function () {
  return (
    <>
      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          <h3>let's gather together </h3>
          <h2>join the community</h2>

          <Button>Open Account now</Button>
        </div>
        <div className={classes.socialLinks}>
          <div className={classes.links}>
            {socialLinks.map((item) => (
              <Link key={item.id} to={item.links} target="blank">
                {icons[item.icon]}
              </Link>
            ))}
          </div>
          <span>Copyright &copy; 2023 Sabbir Hossain. All right reserved.</span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
