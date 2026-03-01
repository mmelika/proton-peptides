import { render, act, screen } from '@testing-library/react'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { CartItem } from '@/types'

const testItem: CartItem = {
  productId: 'bpc-157',
  productSlug: 'bpc-157',
  productName: 'BPC-157',
  variantLabel: '10mg',
  variantSku: 'BPC157-10',
  price: 55,
  quantity: 1,
}

function TestConsumer() {
  const { items, total, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCart()
  return (
    <div>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="total">{total}</span>
      <button onClick={() => addItem(testItem)}>add</button>
      <button onClick={() => removeItem('BPC157-10')}>remove</button>
      <button onClick={() => updateQuantity('BPC157-10', 3)}>update</button>
      <button onClick={() => clearCart()}>clear</button>
    </div>
  )
}

describe('CartContext', () => {
  beforeEach(() => localStorage.clear())

  it('starts empty', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
  })

  it('adds an item', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByTestId('total').textContent).toBe('55')
  })

  it('increments quantity on duplicate add', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    act(() => { screen.getByText('add').click() })
    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(screen.getByTestId('total').textContent).toBe('110')
  })

  it('removes an item', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    act(() => { screen.getByText('remove').click() })
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('updates quantity', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    act(() => { screen.getByText('update').click() })
    expect(screen.getByTestId('count').textContent).toBe('3')
    expect(screen.getByTestId('total').textContent).toBe('165')
  })

  it('clears cart', () => {
    render(<CartProvider><TestConsumer /></CartProvider>)
    act(() => { screen.getByText('add').click() })
    act(() => { screen.getByText('clear').click() })
    expect(screen.getByTestId('count').textContent).toBe('0')
  })
})
