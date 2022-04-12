import { FC, useRef, useState } from "react";
import SplitPane from "react-split-pane";

import OrderArchiveDetails from "./OrderArchiveDetails";
import OrdersArchiveList, {
  OrdersArchiveListHandle,
} from "./OrdersArchiveList";

import styles from "../../components/SplitPaneWithSnap.module.css";
import { order_template } from "../orders/OrdersPage";

const OrdersArchivePage: FC = () => {
  const [orderId, setOrderId] = useState<number | undefined>();
  const orderListRef = useRef<OrdersArchiveListHandle>(null);
  return (
    <SplitPane
      split="vertical"
      minSize={180}
      defaultSize={480}
      className={styles.splitpane}
    >
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <OrdersArchiveList
            ref={orderListRef}
            onItemClickId={setOrderId}
            template={order_template}
          />
        </div>
      </div>
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <OrderArchiveDetails
            orderId={orderId}
            template={order_template}
            onUpdate={orderListRef.current?.refetch}
          />
        </div>
      </div>
    </SplitPane>
  );
};

export default OrdersArchivePage;
