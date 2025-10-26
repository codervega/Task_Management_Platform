import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        <div style={styles.section}>
          <h3 style={styles.title}>Abhishek Shukla</h3>
          <p style={styles.text}>Full-Stack Developer | Task Manager App</p>
          <p style={styles.text}>📧 Email: abhishek@example.com</p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.subtitle}>Quick Links</h4>
          <ul style={styles.list}>
            <li><a href="/" style={styles.link}>Home</a></li>
            <li><a href="/tasks" style={styles.link}>My Tasks</a></li>
            <li><a href="/profile" style={styles.link}>Profile</a></li>
          </ul>
        </div>

        <div style={styles.section}>
          <h4 style={styles.subtitle}>Follow Me</h4>
          <ul style={styles.list}>
            <li><a href="#" style={styles.link}>LinkedIn</a></li>
            <li><a href="#" style={styles.link}>GitHub</a></li>
          </ul>
        </div>

      </div>

      <p style={styles.copyRight}>
        © {new Date().getFullYear()} Abhishek Shukla — All Rights Reserved
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: "30px 20px",
    marginTop: "40px",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
  },
  section: {
    minWidth: "200px",
  },
  title: {
    marginBottom: "10px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  subtitle: {
    fontWeight: "600",
    marginBottom: "10px",
  },
  text: {
    opacity: 0.8,
    marginBottom: "6px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    lineHeight: "1.8",
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
  },
  copyRight: {
    textAlign: "center",
    marginTop: "25px",
    opacity: 0.7,
    fontSize: "14px",
  },
};

export default Footer;
