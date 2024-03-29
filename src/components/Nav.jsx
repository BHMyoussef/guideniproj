import React, { useEffect, useState, useRef } from "react";
import Icon from "./Icon";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaRegHeart,
  FaRegUser,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthProvider";
import "../dropDownMenu.css";

import { useLang } from "../contexts/LangProvider";

export default function Nav() {
  return (
    <>
      <UpNave />
      <NavBare />
    </>
  );
}

function UpNave() {
  const { nav, currentLang } = useLang();
  return (
    <div className="bg-bgcolor w-full">
      <div
        className={`container mx-auto flex justify-between items-center${
          currentLang === "ar" && " flex-row-reverse"
        }`}
      >
        <p>
          {nav && nav.upNav.slug.slug1}{" "}
          <span className="font-bold">{nav && nav.upNav.slug.slug2}</span>{" "}
          {nav && nav.upNav.slug.slug3}
        </p>
        <Link to="/blog" className="hover:text-additional">
          {nav && nav.upNav.blog}
        </Link>
        <div className="hidden md:flex justify-between gap-x-4">
          <Icon icon={<FaFacebookF className="group-hover:text-blue-500" />} />
          <Icon icon={<FaInstagram className="group-hover:text-pink-400" />} />
          <Icon icon={<FaLinkedinIn className="group-hover:text-blue-800" />} />
          <Icon icon={<FaYoutube className="group-hover:text-red-500" />} />
        </div>
        <SelectLanguage choices={["English", "Français", "العربية"]} />
      </div>
    </div>
  );
}

function SelectLanguage({ choices }) {
  const [language, setLanguage] = useState();
  const { handleSelectedLang } = useLang();
  const checkbox = useRef();

  const handleClick = () => {
    function handleClickOutside(event) {
      if (event.target.tagName !== "LI") checkbox.current.checked = false;
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
  };
  useEffect(() => {
    handleClick();
    // i get an issue here, most of the time this line doesn't work
    // like expected, so the quick/easy solution i found is:
    // to change the name of the `key` inside the storage (in this case it: `lang`)
    const DefaultLanguage = localStorage.getItem("Lang") || "English";
    setLanguage(DefaultLanguage);
  }, []);
  useEffect(() => {
    localStorage.setItem("Lang", language);
    handleSelectedLang(language);
    checkbox.current.checked = false;
  }, [language]);
  return (
    <div className="relative group">
      <input ref={checkbox} type="checkbox" className="hidden peer" id="Lang" />
      <label htmlFor="Lang">
        {language}{" "}
        <span className="absolute group-hover:rotate-90 transition-all ease-out">
          {">"}
        </span>
      </label>
      <ul className="absolute scale-0 w-28 peer-checked:scale-100 transition-all ease-out z-10">
        {choices.map((choice, index) => {
          return (
            <div key={index}>
              <li
                className="relative bg-bgcolor px-4 pt-2 pb-2 hover:bg-primary hover:text-white cursor-pointer"
                onClick={() => {
                  setLanguage(choice);
                }}
              >
                {choice}
              </li>
              <hr />
            </div>
          );
        })}
      </ul>
    </div>
  );
}

function NavBare() {
  const { currentUser, currentUserInfo } = useAuth();
  const { nav } = useLang();

  return (
    <>
      <div className="container flex justify-between items-center mx-auto mt-5 h-24">
        <Link className="" to="/">
          <img
            className="inline-block w-16 "
            src={`${window.location.origin}/logo192.png`}
            alt="guideNi Logo"
          />
          <span className="font-bold block md:inline-block text-blue-900 text-lg">
            guideNi
          </span>
        </Link>
        {/* <span className='hidden lg:flex flex-grow-[2] h-full bg-gray-600 text-white justify-center mx-2 items-center'>Ads Here</span> */}
        <div className="text-center">
          {!currentUser ? (
            <>
              <Link className="mx-2 py-2 px-3 md:mx-4 text-center text-white rounded border-[1px] border-gray-500  bg-gray-500 hover:border-[1px] hover:bg-white hover:text-gray-500  min-w-[150px] w-auto" to="/signin">
                {nav && nav.nav.sign.signIn}
              </Link>
              <Link className="mx-2 py-2 px-3 md:mx-4 text-center bg-white rounded border-[1px] border-gray-400 hover:bg-gray-500 hover:text-white  min-w-[150px] w-auto" to="/signup">
                {nav && nav.nav.sign.signup}
              </Link>
            </>
          ) : (
            <p className="mx-4">
              {nav && nav.nav.welcom}{" "}
              <span className="font-semibold">
                {currentUserInfo?.firstName}
              </span>
            </p>
          )}
        </div>
        {currentUser && (
          <div className="flex gap-x-3 relative">
            <Icon
              icon={
                <FaRegHeart size={35} className="hover:text-secondary group" />
              }
            />
            <Icon
              icon={<FaRegUser size={35} className="hover:text-secondary" />}
            >
              <DropDownMenu />
            </Icon>
          </div>
        )}
      </div>
      <div>
        {/* <span className='flex lg:hidden flex-grow-[2] h-20 bg-gray-600 text-white justify-center mx-2 items-center'>Ads Here</span> */}
      </div>
    </>
  );
}

function DropDownMenu() {
  const { currentUserInfo, signOutLogin } = useAuth();
  const { nav } = useLang();
  function logOut() {
    signOutLogin();
  }
  return (
    <div className="setting hidden absolute top-full z-10 right-0 w-52 bg-bgcolor group-hover:block">
      <ul>
        <li>
          <Link to="/profile">{nav && nav.nav.profile.profile}</Link>
        </li>
        <li>
          <Link to="/setting">{nav && nav.nav.profile.setting}</Link>
        </li>
        <li>
          <Link to="/help">{nav && nav.nav.profile.help}</Link>
        </li>
        <li>
          <button onClick={logOut}>{nav && nav.nav.profile.logOut}</button>
        </li>
      </ul>
    </div>
  );
}
