import styles from './Button.module.css';

export default function Button({ variant = 'primary', className, children, ...rest }) {
  const base = variant === 'outline' ? styles.outline : styles.primary;
  const combined = className ? `${base} ${className}` : base;
  return (
    <button className={combined} {...rest}>
      {children}
    </button>
  );
}