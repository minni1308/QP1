import React from "react";
import {
  Provider,
  Heading,
  Subhead,
  Flex,
  Box,
  Text,
} from "rebass";
import { Hero, CallToAction, Feature } from "react-landing-page";

const LandingComponent = () => {
  return (
    <Provider>
      {/* Hero Section */}
      <Hero
        color="white"
        backgroundImage="/landing1.jpg"
        bg="black"
        bgOpacity={0.5}
        style={{
          textAlign: "center",
          padding: "50px 20px",
        }}
      >
        <Heading fontSize={[5, 6]} color="white">
          Welcome to Question Paper Generator
        </Heading>
        <Subhead fontSize={[2, 3]} color="white" mt={2}>
          Instant Unique Question Papers
        </Subhead>
        <Flex mt={4} justifyContent="center">
          <CallToAction href="/insert" mr={3} bg="green" color="white">
            Add Questions
          </CallToAction>
          <CallToAction href="/generate" bg="red" color="white">
            Generate Paper
          </CallToAction>
        </Flex>
      </Hero>

      {/* Features Section */}
      <Box bg="lightgray" py={5}>
        <Heading textAlign="center" fontSize={[4, 5]} color="black">
          What is inside?
        </Heading>
        <Flex flexWrap="wrap" justifyContent="center" mt={4}>
          <Feature icon="⌨" description="Insert New Questions for Subjects">
            Insert
          </Feature>
          <Feature icon="💻" description="Generate Unique Question Papers">
            Generate
          </Feature>
          <Feature icon="⌫" description="Select, Modify and Delete Questions">
            Edit
          </Feature>
        </Flex>
      </Box>

      {/* Why This Project Section */}
      <Box py={5} bg="white">
        <Heading textAlign="center" fontSize={[4, 5]} color="black">
          Why do this Project?
        </Heading>
        <Subhead textAlign="center" fontSize={[2, 3]} color="gray" mt={2}>
          Maybe this will help
        </Subhead>
        <Flex flexWrap="wrap" justifyContent="center" mt={4}>
          <Feature icon="★" description="Automate the Task">
            Automation
          </Feature>
          <Feature icon="★" description="Instant Question Paper">
            Instant Papers
          </Feature>
          <Feature icon="★" description="Random Questions">
            Randomization
          </Feature>
        </Flex>
      </Box>
    </Provider>
  );
};

export default LandingComponent;