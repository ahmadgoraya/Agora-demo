import CallScreen from "@/components/CallScreen";
import LoginScreen from "@/components/LoginScreen";
import { useUser } from "@/contexts/UserContext";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const Home = () => {
  const { isLoggedIn } = useUser();
  const params = useLocalSearchParams();

  // If user is logged in or has call parameters, show call screen
  if (isLoggedIn || params.from) {
    return <CallScreen />;
  }

  // Otherwise show login screen
  return <LoginScreen />;
};

export default Home;
