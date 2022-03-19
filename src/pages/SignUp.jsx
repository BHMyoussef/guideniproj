import React, { useState } from "react";
import UserForm from "../components/UserForm";
import EmployeeForm from "../components/EmployeeForm";
import { langContext } from "../contexts/LangProvider"

export default function Start() {
  const [identity, setIdentity] = useState("User");

  const isSelectedValue = (value) => {
    return identity === value;
  };

  return (
    <langContext.Consumer>
      {
        value =>
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold text-center">{value.signUp && value.signUp.title}: </h2>
          <div className="flex justify-around my-5">
              <div className="">
                  <input
                      onChange={() => setIdentity("User")}
                      className="hidden peer"
                      id="user"
                      type="radio"
                      name="choice"
                      checked={isSelectedValue("User")}
                      />
                  <label className="py-2 px-4 rounded-lg cursor-pointer hover:opacity-90 font-medium text-md bg-bgcolor border-2 peer-checked:bg-secondary peer-checked:text-white" htmlFor="user">
                    {value.signUp &&value.signUp.user}
                  </label>
              </div>
              <div className={isSelectedValue("Employe")?"btn btn-primary form-check d-inline-block me-3 active" :"form-check d-inline-block me-3"}>
                  <input
                      onChange={() => setIdentity("Employe")}
                      className="hidden peer"
                      type="radio"
                      name="choice"
                      id="employe"
                      checked={isSelectedValue("Employe")}
                      />
                  <label className="py-2 px-4 rounded-lg cursor-pointer hover:opacity-90 font-medium text-md bg-bgcolor border-2 peer-checked:bg-secondary peer-checked:text-white" id="employe" htmlFor="employe">
                    {value.signUp &&value.signUp.employe}
                  </label>
              </div>
        </div>
        {identity === "User" && <UserForm />}
        {identity === "Employe" && <EmployeeForm />}

      </div>
      }
    </langContext.Consumer>
  );
}
