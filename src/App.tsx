import React from 'react';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

// .productCards:hover .viewProduct
//   display: block
//   cursor: pointer
//   position: absolute
//   bottom: 0
//   width: 100%
//   color: #fff
//   background: #6d84ffcc
//   padding: 10px 0
//   text-align: center
//   transition: 1s ease-in-out
//   &:hover
//     text-decoration: underline

interface ProductItem {
  id: string | number;
  name: string;
  price: string | number;
  image: string;
  ratings: number;
  reviews: number;
  link: string;
}

const RatingsBar: Array<string> = [
  "⭐",
  "⭐ ⭐",
  "⭐ ⭐ ⭐",
  "⭐ ⭐ ⭐ ⭐",
  "⭐ ⭐ ⭐ ⭐ ⭐"
]

const ProductCards: React.FC<ProductItem> = ({
  id,
  name,
  price,
  image,
  ratings,
  reviews,
  link
}) => {
  return (
    <div style={{ width: "280px", marginTop: "15px" }}>
      <div style={{ width: "100%", height: "200px" }}>
        <img src={image} alt={name} style={{ width: "100%", objectFit: "cover", height: "100%" }} />
        <div style={{ display: 'none' }}>View Product</div>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: 'column', gap: "5px" }}>
        <h5 style={{ fontSize: "14px", textTransform: "capitalize", fontWeight: '500', margin: "10px 0 0 0" }}>{name}</h5>
        <div style={{ fontSize: "14px", fontWeight: '600', color: "#6d84ff" }}><span style={{ fontSize: "14px", color: "#333", fontWeight: "300", textDecoration: "line-through", marginRight: "5px" }}>Rs.{price}</span>Rs.{price}</div>
        <div style={{ fontSize: "12px", color: "#333" }}>{`${RatingsBar[ratings - 1]}  (${reviews})`}</div>
      </div>
    </div >
  )
}

const App: React.FC = () => {

  const items = [
    {
      title: "title",
      image: "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/09/instagram-image-size.jpg",
      price: 100,
      link: "link"
    },
    {
      title: "title",
      image: "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/09/instagram-image-size.jpg",
      price: 100,
      link: "link"
    },
    {
      title: "title",
      image: "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/09/instagram-image-size.jpg",
      price: 100,
      link: "link"
    },
    {
      title: "title",
      image: "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/09/instagram-image-size.jpg",
      price: 100,
      link: "link"
    },
    {
      title: "title",
      image: "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/09/instagram-image-size.jpg",
      price: 100,
      link: "link"
    },
    {
      title: "title",
      image: "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/09/instagram-image-size.jpg",
      price: 100,
      link: "link"
    },
    {
      title: "title",
      image: "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/09/instagram-image-size.jpg",
      price: 100,
      link: "link"
    }
  ];

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <h2 style={{ color: "white" }}>Wisdom Nuggets</h2>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: "15px" }}>
            {items.map((item, index) => (
              <ProductCards
                key={index}
                id={index}
                name={item.title}
                image={item.image}
                price={item.price}
                link={item.link}
                ratings={4}
                reviews={100}
              />
            ))}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Amazon Finds ©{new Date().getFullYear()} Owned by Wisdom Nuggets
      </Footer>
    </Layout>
  );
};

export default App;