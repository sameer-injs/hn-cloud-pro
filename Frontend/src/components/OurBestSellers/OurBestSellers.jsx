import { useRef } from "react"
import { useCart } from "../../CartContext/CartContext"
import { ShoppingCart, Plus, Minus, Star, ChevronLeft, ChevronRight } from "lucide-react"

import { ourBestSellersStyles as styles } from "../../assets/dummystyles"
import { bgColors,obsbooks } from '../../assets/dummydata'

const OurBestSellers = () => {
  const { cart, dispatch } = useCart()
  const scrollRef = useRef(null)


  const inCart = (id) => cart?.items?.some(item => item.id === id)
  const getQty = (id) => cart?.items?.find(item => item.id === id)?.quantity || 0
  const handleAdd = (book) => dispatch({ type: "ADD_ITEM", payload: { ...book, quantity: 1 } })
  const handleInc = (id) => dispatch({ type: "INCREMENT", payload: { id } })
  const handleDec = (id) => dispatch({ type: "DECREMENT", payload: { id } })

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -400, behavior: "smooth" })
  const scrollRight = () => scrollRef.current.scrollBy({ left: 400, behavior: "smooth" })

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerWrapper}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              <span className={styles.gradientText}>Curated Excellence</span>
            </h1>
            <p className={styles.subtitle}>Top Rated by Our Readers</p>
          </div>

          <div className={styles.navWrapper}>
            <div className={styles.navLine} />
            <div className={styles.navButtons}>
              <button onClick={scrollLeft} className={styles.navBtn}>
                <ChevronLeft className={styles.navIcon} size={20} />
              </button>
              <button onClick={scrollRight} className={styles.navBtn}>
                <ChevronRight className={styles.navIcon} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* obsbooks */}
        <div ref={scrollRef} className={styles.scrollContainer}>
          {obsbooks.map((book, index) => (
            <div key={book.id} className={styles.card(bgColors[index % bgColors.length])}>
              <div className={styles.cardInner}>
                <div className="space-y-3 md:space-y-4">
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <div className={styles.bookInfo}>
                    <h2 className={styles.bookTitle}>{book.title}</h2>
                    <p className={styles.bookAuthor}>{book.author}</p>
                  </div>
                  <p className={styles.bookDesc}>
                    Jane McLane's latest masterpiece challenges conventional storytelling. Explore transformative 
                    narratives that...
                  </p>
                </div>

                <div className={styles.cartControls}>
                  <div className={styles.priceQtyWrapper}>
                    <span className={styles.price}>₹{book.price.toFixed(2)}</span>
                    {inCart(book.id) ? (
                      <div className={styles.qtyWrapper}>
                        <button onClick={() => handleDec(book.id)} className={styles.qtyBtn}>
                          <Minus size={18} />
                        </button>
                        <span className={styles.qtyText}>{getQty(book.id)}</span>
                        <button onClick={() => handleInc(book.id)} className={styles.qtyBtn}>
                          <Plus size={18} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleAdd(book)} className={styles.addButton}>
                        <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                        <span>Add to Collection</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <img src={book.image} alt={book.title} className={styles.bookImage} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurBestSellers
