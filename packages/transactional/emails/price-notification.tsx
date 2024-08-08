import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface Props {
  trimName: string;
  newPrice: number;
  modelSlug: string;
}

const baseUrl = "https://www.playtesla.xyz";

export const PriceNotificationEmail = ({
  trimName,
  newPrice,
  modelSlug,
}: Props) => (
  <Html>
    <Head />
    <Preview>
      {trimName} 차량 가격이 {newPrice.toLocaleString()}로 변동 되었습니다.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo/horizontal_logo.svg`}
          width="170"
          height="50"
          alt="Play Tesla Logo"
          style={logo}
        />
        <Text style={paragraph}>
          {trimName} 차량 가격이 {newPrice.toLocaleString()}원으로 변동
          되었습니다.
        </Text>
        <Section style={btnContainer}>
          <Button
            style={button}
            href={`https://www.playtesla.xyz/prices/${modelSlug}`}
          >
            자세히 알아보기
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>playtesla.xyz</Text>
      </Container>
    </Body>
  </Html>
);

PriceNotificationEmail.PreviewProps = {
  trimName: "Performance",
  modelName: "모델 Y",
  newPrice: 1000000000,
  modelSlug: "modely",
} as Props;

export default PriceNotificationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "48px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
