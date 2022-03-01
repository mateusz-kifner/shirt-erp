import { CSSProperties, FC } from "react";
import { Image, Descriptions, Card, Avatar } from "antd";

// import { v4 as uuidv4 } from "uuid"
import { format } from "date-fns/esm";
import { pl } from "date-fns/esm/locale";

import styles from "./DetailsComponent.module.css";
import { useRecoilValue } from "recoil";
import { loginState } from "../atoms/loginState";
import { OrderType } from "../types/OrderType";
import { status_colors, status_icons } from "../pages/orders/OrdersList";
import { ProductComponentType } from "../types/ProductComponentType";
import Color from "./details/Color";
import Files from "./details/Files";
import { WorkstationType } from "../types/WorkstationType";
import WorkstationsIds from "./details/WorkstationsIds";
import User from "./details/User";
import Users from "./details/Users";

const serverURL =
  import.meta.env.REACT_APP_SERVER_URL || "http://localhost:1337";

const { Meta } = Card;

interface DetailsComponentProps {
  data: any;
  labelStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  style?: CSSProperties;
}

const DetailsComponent: FC<DetailsComponentProps> = ({
  data,
  labelStyle,
  contentStyle,
  style,
}) => {
  const login = useRecoilValue(loginState);

  return (
    <div className={styles.container}>
      {data && (
        <Descriptions
          column={1}
          contentStyle={contentStyle}
          labelStyle={labelStyle}
          style={style}
          bordered
        >
          {Object.keys(data).map((name: any) => {
            const { label, value, type } = data[name];
            if (data[name]?.hide) return undefined;
            switch (type) {
              // @ts-ignore: fallthough
              case "id":
                if (!login.debug) break;
              case "string":
              case "number":
              case "enum":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                    contentStyle={{ whiteSpace: "pre-wrap" }}
                  >
                    {value && value}
                  </Descriptions.Item>
                );
              case "money":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                  >
                    {value && value.toFixed(2)} PLN
                  </Descriptions.Item>
                );

              case "boolean":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                  >
                    {value !== undefined && value ? "Tak" : "Nie"}
                  </Descriptions.Item>
                );
              case "image":
                const isSvg = value?.ext && value?.ext === ".svg";
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                  >
                    <div className={styles.image}>
                      <Image
                        width={isSvg ? 256 : data[name].width}
                        height={isSvg ? 256 : data[name].height}
                        src={value?.url && serverURL + value.url}
                        preview={
                          data[name].preview !== undefined && data[name].preview
                        }
                      />
                    </div>
                  </Descriptions.Item>
                );
              case "address":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label.name}
                    labelStyle={{ textAlign: "right" }}
                  >
                    <div>
                      {value?.streetName ? "ul. " + value?.streetName : ""}{" "}
                      {value?.streetNumber}
                      {value?.apartmentNumber
                        ? "/" + value?.apartmentNumber
                        : ""}
                    </div>
                    <div>{`${value?.postCode} ${value?.city}`}</div>
                    <span>woj. {value?.province}</span>
                  </Descriptions.Item>
                );
              case "datetime":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                  >
                    {value && format(new Date(value), "Pp", { locale: pl })}
                  </Descriptions.Item>
                );
              case "date":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                  >
                    {value && format(new Date(value), "P", { locale: pl })}
                  </Descriptions.Item>
                );
              case "color":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                  >
                    <Color color={value && value} />
                  </Descriptions.Item>
                );
              case "files":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                  >
                    <Files files={value} />
                  </Descriptions.Item>
                );
              case "client":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                    contentStyle={{ padding: 0 }}

                    // style={{ padding: 0 }}
                  >
                    <Card
                      style={{
                        height: "100%",
                        width: "100%",
                        margin: 0,
                        border: "none",
                      }}
                    >
                      {value ? (
                        <Meta
                          avatar={
                            <div
                              style={{
                                height: 48,
                                width: 48,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "var(--gray)",
                                borderRadius: "100%",
                                fontSize: 24,
                                color: "var(--background1)",
                              }}
                            >
                              {(value.firstname ? value.firstname[0] : "") +
                                (value.lastname ? value.lastname[0] : "")}
                            </div>
                          }
                          title={
                            (value.firstname ? value.firstname : "") +
                            " " +
                            (value.lastname ? value.lastname : "") +
                            (value.companyName && value.companyName?.length > 0
                              ? ` (${value.companyName})`
                              : "")
                          }
                          description={
                            value.username +
                            (value.email && value.email?.length > 0
                              ? ` (${value.email})`
                              : "")
                          }
                        />
                      ) : (
                        <Meta title="Nie podano klienta" />
                      )}
                    </Card>
                  </Descriptions.Item>
                );
              case "orders":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                    contentStyle={{ padding: 0 }}
                  >
                    {value && value?.length > 0 ? (
                      value.map((order: OrderType, index: number) => (
                        <Card
                          key={name + index}
                          style={{
                            height: "100%",
                            width: "100%",
                            margin: 0,
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                          }}
                        >
                          <Meta
                            avatar={
                              <Avatar
                                icon={
                                  status_icons[
                                    order.status.replace(
                                      " ",
                                      "_"
                                    ) as keyof typeof status_icons
                                  ]
                                }
                                style={{
                                  color: "#111",
                                  backgroundColor:
                                    status_colors[
                                      order.status.replace(
                                        " ",
                                        "_"
                                      ) as keyof typeof status_icons
                                    ],
                                }}
                              />
                            }
                            title={order.name}
                            description={order.status}
                          />
                        </Card>
                      ))
                    ) : (
                      <div style={{ padding: "2rem" }}>Brak</div>
                    )}
                  </Descriptions.Item>
                );
              case "workstations":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                    contentStyle={{ padding: 0 }}
                  >
                    {value && value?.length > 0 ? (
                      value.map(
                        (workstation: WorkstationType, index: number) => (
                          <Card
                            key={name + index}
                            style={{
                              height: "100%",
                              width: "100%",
                              margin: 0,
                              borderTop: "none",
                              borderLeft: "none",
                              borderRight: "none",
                            }}
                          >
                            <Meta
                              avatar={
                                <Avatar
                                  icon={
                                    workstation?.icon?.url && (
                                      <img
                                        src={serverURL + workstation?.icon?.url}
                                        alt=""
                                      />
                                    )
                                  }
                                  // style={{ backgroundColor: workstation?.color?.colorHex }}
                                />
                              }
                              title={workstation.name}
                              description={workstation.desc}
                            />
                          </Card>
                        )
                      )
                    ) : (
                      <div style={{ padding: "2rem" }}>Brak</div>
                    )}
                  </Descriptions.Item>
                );
              case "workstationsIds":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                    contentStyle={{ padding: 0 }}
                  >
                    <WorkstationsIds workstationsIds={value} />
                  </Descriptions.Item>
                );
              case "productcomponents":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                    contentStyle={{ padding: 0 }}
                  >
                    {value && value?.length > 0 ? (
                      value.map(
                        (
                          productComponent: ProductComponentType,
                          index: number
                        ) => (
                          <Card
                            key={name + index}
                            style={{
                              height: "100%",
                              width: "100%",
                              margin: 0,
                              borderTop: "none",
                              borderLeft: "none",
                              borderRight: "none",
                              backgroundColor: productComponent.ready
                                ? "#103301"
                                : undefined,
                            }}
                          >
                            <Meta
                              avatar={
                                <Avatar
                                  icon={
                                    productComponent?.product?.icon?.url && (
                                      <img
                                        src={
                                          serverURL +
                                          productComponent?.product?.icon?.url
                                        }
                                        alt={
                                          productComponent?.product?.category
                                        }
                                      />
                                    )
                                  }
                                  style={{
                                    backgroundColor:
                                      productComponent?.product?.color
                                        ?.colorHex,
                                  }}
                                />
                              }
                              title={
                                <>
                                  {productComponent?.product?.name}
                                  <b> x{productComponent?.count}</b>
                                </>
                              }
                              description={
                                <>
                                  {productComponent?.product?.codeName &&
                                    `kod: ${productComponent?.product?.codeName}, `}
                                  {productComponent?.size &&
                                    `rozmiar: ${productComponent?.size}, `}
                                  {productComponent?.product?.color && (
                                    <>
                                      color:
                                      <Color
                                        color={productComponent?.product?.color}
                                        small
                                      />
                                    </>
                                  )}
                                </>
                              }
                            />
                          </Card>
                        )
                      )
                    ) : (
                      <div style={{ padding: "2rem" }}>Brak</div>
                    )}
                  </Descriptions.Item>
                );
              case "user":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                    contentStyle={{ padding: 0 }}
                  >
                    <User user={value} />
                  </Descriptions.Item>
                );
              case "users":
                return (
                  <Descriptions.Item
                    key={name}
                    label={label}
                    labelStyle={{ textAlign: "right" }}
                    contentStyle={{ padding: 0 }}
                  >
                    <Users users={value} />
                  </Descriptions.Item>
                );
              default:
                return login.debug ? (
                  <div key={name}>
                    Not implemented Input filed named: {name}
                    <pre
                      style={{
                        overflow: "hidden",
                        padding: 10,
                        margin: 10,
                        background: "#111",
                        color: "#ddd",
                      }}
                    >
                      {JSON.stringify(data[name], null, 2)}
                    </pre>
                  </div>
                ) : undefined;
            }
          })}
        </Descriptions>
      )}
    </div>
  );
};

export default DetailsComponent;
