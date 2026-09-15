import styles from './Button.module.css';

export default function Button({ variant = 'primary', children, ...rest }) {
  const className = variant === 'outline' ? styles.outline : styles.primary;
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}