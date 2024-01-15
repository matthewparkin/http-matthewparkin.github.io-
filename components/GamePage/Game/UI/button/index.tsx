import * as React from "react";

// Styles
import css from "./index.module.scss";

interface IProps {
    spin: () => void;
    claimPrize: () => void;
    isSpinning: boolean;
    hasSpun: boolean;
    hasWon: boolean;
    canSpin: boolean;
}

// imported and modified heavily from 2D version.
const Button = (props: IProps) => {
    if (props.hasSpun && !props.hasWon) {
        return null;
    }

    if (!props.canSpin || props.isSpinning) {
        return null;
    }

    let buttonText = "Spin here";

    if (props.hasSpun && props.hasWon) {
        buttonText = "Claim Prize";
    }

    const onClick = () => {
        if (!props.hasSpun && !props.isSpinning) {
            props.spin();
        }

        if (props.hasWon && props.hasSpun) {
            props.claimPrize();
        }
    };

    return (
        <button className={css.button} onClick={onClick}>
            {buttonText}
        </button>
    );
};

Button.displayName = "Button";

export default React.memo(Button);
