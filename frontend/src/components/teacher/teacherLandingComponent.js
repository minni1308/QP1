import React from "react";
import {
  Provider,
  Heading,
  Subhead,
  Flex,
  Box,
} from "rebass";
import { Hero, CallToAction, Feature } from "react-landing-page";

const TeacherLandingComponent = () => {
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
          Teacher Dashboard
        </Heading>
        <Subhead fontSize={[2, 3]} color="white" mt={2}>
          Manage Your Question Papers
        </Subhead>
        <Flex mt={4} justifyContent="center">
          <CallToAction href="/teacher/insert" mr={3} bg="green" color="white">
            Add Questions
          </CallToAction>
          <CallToAction href="/teacher/generate" mr={3} bg="blue" color="white">
            Generate Paper
          </CallToAction>
          <CallToAction href="/teacher/generate-questions" bg="purple" color="white">
            Generate Questions
          </CallToAction>
        </Flex>
      </Hero>

      {/* Features Section */}
      <Box bg="lightgray" py={5}>
        <Heading textAlign="center" fontSize={[4, 5]} color="black">
          Available Actions
        </Heading>
        <Flex flexWrap="wrap" justifyContent="center" mt={4}>
          <Feature icon="⌨" description="Add new questions to the database">
            Add Questions
          </Feature>
          <Feature icon="💻" description="Generate unique question papers">
            Generate Papers
          </Feature>
          <Feature icon="❓" description="Generate new questions automatically">
            Generate Questions
          </Feature>
          <Feature icon="⌫" description="Edit or delete existing questions">
            Manage Questions
          </Feature>
        </Flex>
      </Box>
    </Provider>
  );
};

export default TeacherLandingComponent; 