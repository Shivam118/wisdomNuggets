import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Layout,
  Modal,
  Input,
  Tooltip,
  notification,
} from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import db from "./firebase";

const { Search } = Input;
const { Header, Content, Footer } = Layout;

const RatingsBar = ["⭐", "⭐ ⭐", "⭐ ⭐ ⭐", "⭐ ⭐ ⭐ ⭐", "⭐ ⭐ ⭐ ⭐ ⭐"];

const ProductCards = ({
  id,
  name,
  sellingPrice,
  costPrice,
  image,
  ratings,
  reviews,
  link,
}) => {
  const [hover, setHover] = useState(false);
  const hoverStyle = {
    display: "block",
    cursor: "pointer",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "#fff",
    background: "#6d84ffcc",
    padding: "10px 0",
    textAlign: "center",
    transition: "1s ease-in-out",
  };

  return (
    <div style={{ width: "280px", marginTop: "15px" }}>
      <a href={link} target="_blank" rel="noreferrer">
        <div
          style={{ width: "100%", height: "200px", position: "relative" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img
            src={image}
            alt={name}
            style={{ width: "100%", objectFit: "contain", height: "100%" }}
          />
          <span
            style={{
              fontSize: "20px",
              position: "absolute",
              top: "0px",
              left: "0px",
            }}
          >
            #{id}
          </span>
          <div style={hover ? hoverStyle : { display: "none" }}>
            View Product
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <h5
            style={{
              fontSize: "14px",
              textTransform: "capitalize",
              fontWeight: "500",
              margin: "10px 0 0 0",
              color: "black",
            }}
          >
            {name}
          </h5>
          <div
            style={{ fontSize: "14px", fontWeight: "600", color: "#6d84ff" }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#333",
                fontWeight: "300",
                textDecoration: "line-through",
                marginRight: "5px",
              }}
            >
              Rs.{costPrice}
            </span>
            Rs.{sellingPrice}
          </div>
          <div style={{ fontSize: "12px", color: "#333" }}>{`${
            ratings > 0 ? RatingsBar[ratings - 1] : "No Ratings"
          }  (${reviews})`}</div>
        </div>
      </a>
    </div>
  );
};

const key = "updatable";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState("login");
  const [productsList, setProductsList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [product, setProduct] = useState({
    id: "",
    name: "",
    costPrice: "",
    sellingPrice: "",
    image: "",
    ratings: "",
    reviews: "",
    link: "",
  });

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message) => {
    api.open({
      key,
      message,
    });

    setTimeout(() => {
      api.open({
        key,
        message,
      });
    }, 800);
  };

  const handleUser = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductField = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (modalState === "login") {
        const adminRef = collection(db, "admin");
        const adminSnap = await getDocs(adminRef);
        if (adminSnap.size !== 1) {
          return openNotification("Server Error - Contact Developer");
        }
        const admin = adminSnap.docs[0].data();
        if (admin.username !== user.username) {
          return openNotification("Incorrect Username");
        }
        if (admin.password !== user.password) {
          return openNotification("Incorrect Password");
        } else {
          localStorage.setItem("token", admin.token);
          setIsLoggedIn(true);
          return openNotification("Logged In Successfully");
        }
      }
      if (modalState === "product") {
        const productRef = doc(db, "Products", product.id);
        const adminRef = doc(db, "admin", "SmN8MRlrq36PXTo1U6cU");
        await setDoc(productRef, {
          name: product.name,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          image: product.image,
          ratings: product.ratings,
          reviews: product.reviews,
          link: product.link,
        });
        await updateDoc(adminRef, {
          productCounter: product.id,
        });
        getProducts();
        return openNotification("Product Added Successfully");
      }
    } catch (err) {
      console.log(err);
      return openNotification(err.message);
    } finally {
      setModalOpen(false);
    }
  };

  const onSearch = (value, _e, info) => setSearchText(value);

  const getProducts = async () => {
    const productsRef = collection(db, "Products");
    const productsSnap = await getDocs(productsRef);
    if (productsSnap.size === 0) {
      return openNotification("No Products Found");
    }
    const products = productsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductsList(products);
  };

  const verifyAdmin = async () => {
    const adminRef = collection(db, "admin");
    const adminSnap = await getDocs(adminRef);
    if (adminSnap.size !== 1) {
      return openNotification("Server Error - Contact Developer");
    }
    const admin = adminSnap.docs[0].data();
    const token = localStorage.getItem("token");
    if (admin.token === token) {
      setIsLoggedIn(true);
      setProduct((prev) => ({
        ...prev,
        id: (parseInt(admin.productCounter) + 1).toString(),
      }));
    }
  };

  useEffect(() => {
    verifyAdmin();
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchText === "") {
      getProducts();
    } else {
      (async function () {
        const productsRef = collection(db, "Products");
        const productsSnap = await getDocs(productsRef);
        if (productsSnap.size === 0) {
          return openNotification("No Products Found");
        }
        const products = productsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredProducts = products.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.id.toString().includes(searchText)
        );
        setProductsList(filteredProducts);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <Layout>
      {contextHolder}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          width: "100vw",
          height: "auto",
        }}
      >
        <Flex
          // gap="middle"
          justify={"space-between"}
          align={"center"}
          style={{ width: "100%" }}
          wrap="wrap"
        >
          <h2 style={{ color: "white" }}>Wisdom Nuggets</h2>
          <Search
            placeholder="Input Id or Name"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
          {!isLoggedIn ? (
            <span>
              <Button
                type="primary"
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  setModalOpen(true);
                  setModalState("login");
                }}
              >
                Login
              </Button>
            </span>
          ) : (
            <span>
              <Button
                type="primary"
                onClick={() => {
                  setModalOpen(true);
                  setModalState("product");
                }}
              >
                Add Product
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: "20px" }}
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                }}
                danger
              >
                Log Out
              </Button>
            </span>
          )}
        </Flex>
      </Header>
      <Modal
        title={modalState === "login" ? "Login" : "Add Product"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        {modalState === "login" ? (
          <form name="Login">
            <br />
            <Input
              name="username"
              value={user.username}
              placeholder="Enter your username"
              onChange={handleUser}
              prefix={<UserOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title="Username or Email ID">
                  <InfoCircleOutlined
                    style={{
                      color: "rgba(0,0,0,.45)",
                    }}
                  />
                </Tooltip>
              }
            />
            <br />
            <br />
            <Input.Password
              value={user.password}
              name="password"
              placeholder="Input password"
              onChange={handleUser}
            />
          </form>
        ) : (
          <form name="product">
            <br />
            <Input
              name="id"
              value={product.id}
              disabled={true}
              placeholder="Enter Product ID"
            />
            <br />
            <br />
            <Input
              name="name"
              value={product.name}
              onChange={handleProductField}
              placeholder="Enter Product Name"
            />
            <br />
            <br />
            <Input
              name="costPrice"
              value={product.costPrice}
              onChange={handleProductField}
              placeholder="Enter Cost Price"
              prefix="₹"
              suffix="INR"
            />
            <br />
            <br />
            <Input
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={handleProductField}
              placeholder="Enter Selling Price"
              prefix="₹"
              suffix="INR"
            />
            <br />
            <br />
            <Input
              name="ratings"
              value={product.ratings}
              onChange={handleProductField}
              placeholder="Enter Ratings"
            />
            <br />
            <br />
            <Input
              name="reviews"
              value={product.reviews}
              onChange={handleProductField}
              placeholder="Enter Reviews"
            />
            <br />
            <br />
            <Input
              name="link"
              value={product.link}
              onChange={handleProductField}
              placeholder="Enter Product Link"
            />
            <br />
            <br />
            <input
              type="file"
              name="image"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                  setProduct((prev) => ({ ...prev, image: reader.result }));
                });
                reader.readAsDataURL(file);
              }}
              accept="image/*"
            />
          </form>
        )}
      </Modal>
      <Content style={{ padding: "0 48px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {productsList.map((item) => (
              <ProductCards
                key={item.id}
                id={item.id}
                name={item.name}
                sellingPrice={item.sellingPrice}
                costPrice={item.costPrice}
                ratings={item.ratings}
                image={item.image}
                reviews={item.reviews}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Amazon Finds ©{new Date().getFullYear()} Owned by Wisdom Nuggets
      </Footer>
    </Layout>
  );
};

export default App;
