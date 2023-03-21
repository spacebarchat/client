import React from "react";
import { AuthContext } from "../contexts/Auth";

export default function useAuth() {
  return React.useContext(AuthContext);
}
