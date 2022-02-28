import { FC } from "react";
import {
  Menu,
  Layout,
  Button,
  Tooltip,
  AutoComplete,
  Input,
  Space,
} from "antd";
import {
  UserOutlined,
  PieChartOutlined,
  CrownOutlined,
  DashboardOutlined,
  SettingFilled,
  BellFilled,
  SkinOutlined,
  RocketOutlined,
  BuildOutlined,
  FileOutlined,
  FileUnknownOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import useMobileDetect from "../hooks/useMobileDetect";

import { loginState } from "../atoms/loginState";

import styles from "./PageLayout.module.css";

const { Header, Content, Sider } = Layout;

const renderItem = (title: string, count: number) => ({
  value: title,
  label: (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {title}
      <span>
        <UserOutlined /> {count}
      </span>
    </div>
  ),
});

const options = [
  {
    label: "libraries",
    options: [
      renderItem("AntDesign", 10000),
      renderItem("AntDesign UI", 10600),
    ],
  },
  {
    label: "Solutions",
    options: [
      renderItem("AntDesign UI FAQ", 60100),
      renderItem("AntDesign FAQ", 30010),
    ],
  },
  {
    label: "Articles",
    options: [renderItem("AntDesign design language", 100000)],
  },
];

const PageLayout: FC = ({ children }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const detectMobile = useMobileDetect();
  const [login, setLogin] = useRecoilState(loginState);
  const dark_theme = login.user !== null ? login.user.darkMode : true;
  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "var(--background1)" }}
    >
      <Header className={styles.navbar}>
        {/* <Button
          type="primary"
          shape="circle"
          icon={collapsed ? <LeftOutlined /> : <RightOutlined />}
          onClick={() => setCollapsed((val) => !val)}
        /> */}
        <img className={styles.logo} src="/logo.png" alt="ShirtDipERP" />
        <AutoComplete options={options} className={styles.search} disabled>
          <Input.Search size="large" placeholder="Search" />
        </AutoComplete>
        <Space className={styles.actions}>
          <Tooltip title="Noitifications">
            <Button
              type="text"
              shape="circle"
              icon={
                <BellFilled
                  style={{
                    color: dark_theme ? undefined : "var(--background1)",
                  }}
                />
              }
              size="large"
              disabled
            />
          </Tooltip>
          <Tooltip title="Settings">
            <Button
              type="text"
              shape="circle"
              icon={
                <SettingFilled
                  style={{
                    color: dark_theme ? undefined : "var(--background1)",
                  }}
                />
              }
              size="large"
              onClick={() => navigate("/settings")}
            />
          </Tooltip>
        </Space>
      </Header>
      <Layout style={{ backgroundColor: "var(--background1)" }}>
        <Sider
          theme={dark_theme ? "dark" : "light"}
          collapsible
          collapsed={
            login.menuCollapsed !== undefined ? login.menuCollapsed : false
          }
          collapsedWidth={46}
          onCollapse={(collapsed: boolean) =>
            setLogin((login_data) => ({
              ...login_data,
              menuCollapsed: collapsed,
            }))
          }
        >
          <Menu
            // mode={detectMobile.isMobile() ? "horizontal" : "inline"}
            mode="inline"
            theme={dark_theme ? "dark" : "light"}
            defaultSelectedKeys={[
              location.pathname.split("/").length > 1
                ? location.pathname.split("/")[1]
                : "dashboard",
            ]}
          >
            {/* <Menu.Item
              key="dashboard"
              icon={<DashboardOutlined />}
              onClick={() => navigate("/dashboard")}
            >
              DashBoard
            </Menu.Item> */}
            <Menu.Item
              key="tasks"
              icon={<BuildOutlined />}
              onClick={() => navigate("/tasks")}
            >
              Zadania
            </Menu.Item>

            <Menu.Item
              key="orders"
              icon={<CrownOutlined />}
              onClick={() => navigate("/orders")}
            >
              Zamówienia
            </Menu.Item>
            <Menu.Item
              key="products"
              icon={<SkinOutlined />}
              onClick={() => navigate("/products")}
            >
              Produkty
            </Menu.Item>
            <Menu.Item
              key="clients"
              icon={<UserOutlined />}
              onClick={() => navigate("/clients")}
            >
              Klienci
            </Menu.Item>
            {login.debug && (
              <>
                <Menu.Item
                  key="production"
                  icon={<RocketOutlined />}
                  onClick={() => navigate("/production")}
                >
                  Produkcja
                </Menu.Item>

                <Menu.Item
                  key="expenses"
                  icon={<PieChartOutlined />}
                  onClick={() => navigate("/expenses")}
                >
                  Wydatki
                </Menu.Item>
                <Menu.Item
                  key="files"
                  icon={<FileOutlined />}
                  onClick={() => navigate("/files")}
                >
                  Pliki
                </Menu.Item>

                <Menu.Item
                  key="logger"
                  icon={<FileUnknownOutlined />}
                  onClick={() => navigate("/logger")}
                >
                  Logger
                </Menu.Item>
                <Menu.Item
                  key="orders-archive"
                  icon={<CalendarOutlined />}
                  onClick={() => navigate("/orders-archive")}
                >
                  Zamówienia
                </Menu.Item>
              </>
            )}
          </Menu>
        </Sider>
        <Content className={styles.content}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
