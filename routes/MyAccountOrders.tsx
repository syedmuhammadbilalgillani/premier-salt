export default function MyAccountOrders() {
  // const orders = readOrders();

  return (
    <>
      {/* <PageHero
        eyebrow="Shop"
        title="Your Orders"
        crumbs={[
          { label: "My Account", to: "/my-account" },
          { label: "Orders" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        {orders.length === 0 ? (
          <p className="text-muted-foreground">
            No orders yet in this browser. Orders you place will appear here.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border border-y border-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/order-confirmation/${order.id}`}
                className="flex items-center justify-between py-4 hover:text-primary"
              >
                <div>
                  <p className="font-medium text-charcoal">{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.status}
                  </p>
                </div>
                <span className="font-serif text-primary">
                  PKR {order.total.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div> */}
    </>
  );
}
